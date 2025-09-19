import { Router, Request, Response } from 'express';
import { requireAuth, requireRole } from '.js'.js'.js";
import { upload } from '.js'.js'.js";
import prisma from '.js'.js'.js";
import { notifyBuyerResponse } from '.js'.js'.js";
import { markRFPResponseSubmitted } from '.js'.js'.js";
import { z } from 'zod';

export const responseRouter = Router();

responseRouter.post('/rfps/:id/responses',
  requireAuth, requireRole('SUPPLIER'), upload.single('attachment'),
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const rfp = await prisma.rFP.findUnique({ where: { id } });
    if (!rfp || rfp.status === 'DRAFT') return res.status(404).json({ error: 'RFP not available' });

    const bodySchema = z.object({ message: z.string().min(1) });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const attachmentKey = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;

    const resp = await prisma.response.create({
      data: {
        rfpId: id,
        supplierId: req.user!.sub,
        message: parsed.data.message,
        attachmentKey
      }
    });

    await notifyBuyerResponse(id);
    await markRFPResponseSubmitted(id, req.app);
    res.status(201).json(resp);
  }
);

responseRouter.get('/my/responses', requireAuth, requireRole('SUPPLIER'), async (req: Request & { user?: any }, res: Response) => {
  const items = await prisma.response.findMany({ where: { supplierId: req.user!.sub }, orderBy: { createdAt: 'desc' } });
  res.json(items);
});
