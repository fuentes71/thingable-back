import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function execute() {
  await prisma.$queryRaw`TRUNCATE machines, events CASCADE;`;
}

execute()
  .then(() => console.log('✅ Truncamento executado com sucesso!'))
  .catch(e => console.log('❌ Erro durante o truncamento: ', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
