import { Request, Response } from 'express'
import prisma from '../prisma'.js'.js"
import { z } from 'zod'
import { notifyBuyerResponse, notifySupplierStatusChange, notifySuppliersNewRFP } from '../notifier'.js'.js"
import { searchRFPs } from '../search'.js'.js"

const rfpSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  dueDate: z.string().optional()
})

export async function createRFP(req: Request & { user?: any }, res: Response) {
  const parsed = rfpSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const attachmentKey = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined

  const rfp = await prisma.rFP.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      buyerId: req.user!.sub,
      attachmentKey
    }
  })
  res.status(201).json(rfp)
}

export async function publishRFP(req: Request & { user?: any }, res: Response) {
  const { id } = req.params
  const rfp = await prisma.rFP.update({
    where: { id },
    data: { status: 'PUBLISHED' }
  })
  await notifySuppliersNewRFP(id)
  const io = req.app.get('io')
  io.emit('rfpUpdated', { id, status: rfp.status })
  res.json(rfp)
}

export async function getMyRFPs(req: Request & { user?: any }, res: Response) {
  const rfps = await prisma.rFP.findMany({ where: { buyerId: req.user!.sub }, orderBy: { createdAt: 'desc' } })
  res.json(rfps)
}

export async function listPublished(req: Request, res: Response) {
  const search = (req.query.search as string) || ''
  const rfps = await searchRFPs(search)
  res.json(rfps)
}

export async function getRFP(req: Request, res: Response) {
  const rfp = await prisma.rFP.findUnique({ where: { id: req.params.id } })
  if (!rfp) return res.status(404).json({ error: 'Not found' })
  res.json(rfp)
}

export async function updateRFP(req: Request & { user?: any }, res: Response) {
  const { id } = req.params
  const parsed = rfpSchema.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const existing = await prisma.rFP.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'Not found' })
  if (existing.buyerId !== req.user!.sub) return res.status(403).json({ error: 'Forbidden' })

  // snapshot current version
  await prisma.rFPVersion.create({
    data: {
      rfpId: id,
      version: existing.version,
      title: existing.title,
      description: existing.description,
      attachmentKey: existing.attachmentKey || undefined
    }
  })

  const attachmentKey = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined

  const updated = await prisma.rFP.update({
    where: { id },
    data: {
      title: parsed.data.title ?? existing.title,
      description: parsed.data.description ?? existing.description,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : existing.dueDate,
      version: existing.version + 1,
      attachmentKey: attachmentKey ?? existing.attachmentKey
    }
  })

  const io = req.app.get('io')
  io.emit('rfpUpdated', { id, status: updated.status })
  res.json(updated)
}

export async function markUnderReview(req: Request, res: Response) {
  const { id } = req.params
  const updated = await prisma.rFP.update({ where: { id }, data: { status: 'UNDER_REVIEW' } })
  const io = req.app.get('io')
  io.emit('rfpUpdated', { id, status: updated.status })
  res.json(updated)
}

export async function approveRFP(req: Request, res: Response) {
  const { id } = req.params
  const responseId = (req.body as any)?.responseId as string | undefined

  const updated = await prisma.rFP.update({ where: { id }, data: { status: 'APPROVED' } })
  if (responseId) {
    const resp = await prisma.response.update({ where: { id: responseId }, data: { status: 'APPROVED' } })
    const supplier = await prisma.user.findUnique({ where: { id: resp.supplierId } })
    if (supplier) await notifySupplierStatusChange(supplier.email, updated.title, 'APPROVED')
  }
  const io = req.app.get('io')
  io.emit('rfpUpdated', { id, status: updated.status })
  res.json(updated)
}

export async function rejectRFP(req: Request, res: Response) {
  const { id } = req.params
  const updated = await prisma.rFP.update({ where: { id }, data: { status: 'REJECTED' } })
  const io = req.app.get('io')
  io.emit('rfpUpdated', { id, status: updated.status })
  res.json(updated)
}

export async function listResponsesForBuyer(req: Request, res: Response) {
  const { id } = req.params
  const items = await prisma.response.findMany({
    where: { rfpId: id },
    include: { supplier: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(items)
}

// used by response router to mark status when first response arrives
export async function markRFPResponseSubmitted(rfpId: string, app: any) {
  const rfp = await prisma.rFP.findUnique({ where: { id: rfpId } })
  if (rfp && rfp.status === 'PUBLISHED') {
    const updated = await prisma.rFP.update({ where: { id: rfpId }, data: { status: 'RESPONSE_SUBMITTED' } })
    app.get('io').emit('rfpUpdated', { id: rfpId, status: updated.status })
  }
}
