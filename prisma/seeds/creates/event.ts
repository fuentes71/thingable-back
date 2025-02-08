import { PrismaClient, Estatus } from '@prisma/client';

const eventsDefault = [
  {
    id: 'e3c88d3f-8895-4834-8252-e65d0e908d8a',
    machineId: 'c32f0a40-2d49-4731-8299-b0e9dab9710c',
    name: 'T-1000',
    location: null,
    status: Estatus.OFF,
    timestamp: new Date(),
  },
  {
    id: '79611728-84c5-4f64-abad-a36f2b995270',
    machineId: '34fdf4c0-06a3-4606-ae13-ce0637bf476c',
    name: 'T-2000',
    location: null,
    status: Estatus.OFF,
    timestamp: new Date(),
  }
];

export async function createEvent(prisma: PrismaClient) {
  const machines = await prisma.machine.createMany({ data: eventsDefault });
  return machines;
}
