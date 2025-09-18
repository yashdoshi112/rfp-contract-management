import { prisma } from './prisma';

export async function searchRFPs(query: string) {
  const q = query.trim();
  if (!q) {
    return prisma.rFP.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } });
  }
  // Try full-text search via raw SQL; fallback to ILIKE if DB disallows
  try {
    const results = await prisma.$queryRawUnsafe(`
      SELECT * FROM "RFP"
      WHERE status = 'PUBLISHED'
      AND to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')) @@ plainto_tsquery('english', $1)
      ORDER BY "createdAt" DESC
    `, q);
    // @ts-ignore
    return results;
  } catch {
    return prisma.rFP.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
