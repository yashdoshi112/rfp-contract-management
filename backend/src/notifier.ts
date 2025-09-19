import { prisma } from '.js'.js'.js";
import { sendMail } from '.js'.js'.js";

export async function notifySuppliersNewRFP(rfpId: string) {
  const rfp = await prisma.rFP.findUnique({ where: { id: rfpId }, include: { buyer: true } });
  if (!rfp) return;

  const suppliers = await prisma.user.findMany({ where: { role: 'SUPPLIER' } });
  await Promise.all(suppliers.map(s => sendMail(
    s.email,
    `New RFP Published: ${rfp.title}`,
    `A new RFP "${rfp.title}" has been published by ${rfp.buyer.name}.`
  )));
}

export async function notifyBuyerResponse(rfpId: string) {
  const rfp = await prisma.rFP.findUnique({ where: { id: rfpId }, include: { buyer: true } });
  if (!rfp) return;
  await sendMail(rfp.buyer.email, `New Response for: ${rfp.title}`, `A supplier submitted a response for "${rfp.title}".`);
}

export async function notifySupplierStatusChange(supplierEmail: string, rfpTitle: string, status: string) {
  await sendMail(supplierEmail, `RFP "${rfpTitle}" status update`, `Status changed to: ${status}`);
}
