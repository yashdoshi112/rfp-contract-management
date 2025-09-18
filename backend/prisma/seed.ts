import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: { email: 'buyer@test.com', passwordHash: hash, name: 'Buyer Test', role: Role.BUYER }
  });

  const supplier = await prisma.user.upsert({
    where: { email: 'supplier@test.com' },
    update: {},
    create: { email: 'supplier@test.com', passwordHash: hash, name: 'Supplier Test', role: Role.SUPPLIER }
  });

  console.log('Seeded users:', { buyer: buyer.email, supplier: supplier.email });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
