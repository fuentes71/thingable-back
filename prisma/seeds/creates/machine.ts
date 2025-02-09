import { PrismaClient, Estatus } from '@prisma/client';

const machinesDefault = [
  {
    id: 'c32f0a40-2d49-4731-8299-b0e9dab9710c',
    name: 'T-1000',
    location: '',
    status: Estatus.OFF,
  },
  {
    id: '34fdf4c0-06a3-4606-ae13-ce0637bf476c',
    name: 'T-2000',
    location: '',
    status: Estatus.OFF,
  }
];

export async function createMachine(prisma: PrismaClient) {
  const machines = await prisma.machine.createMany({ data: machinesDefault });
  return machines;
}
