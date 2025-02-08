import { PrismaClient } from '@prisma/client';

import 'dotenv/config';
import { createMachine } from './creates';
import { createEvent } from './creates/event';

const prisma = new PrismaClient();

async function execute() {
  console.log('Seeding...');
  
  await createMachine(prisma);
  await createEvent(prisma);
}

(async () => {
  try {
    await execute();
    console.log('✅ Seeds executados com sucesso!');
  } catch (error) {
    await import('./truncate');
    console.log('❌ Erro ao tentar executar os seeds: ');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
