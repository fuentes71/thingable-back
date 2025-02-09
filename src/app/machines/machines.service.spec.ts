import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { EStatus } from 'src/shared/enums';
import { CreateMachineDto } from './dto';
const makeSut = () => {
  const createMachinePrisma = {
    id: 'any_id',
    name: 'any_name',
    location: 'any_location',
    status: EStatus.OFF
  };

  return {
    createMachinePrisma
  }
}
describe('MachinesService', () => {
  let machineService: MachinesService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachinesService, PrismaService, ConfigService],
    }).compile();

    machineService = module.get<MachinesService>(MachinesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    await prismaService.machine.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(machineService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create', () => {
    it('Deve criar uma nova máquina', async () => {
      const result = await machineService.create({ name: 'any_name' } as CreateMachineDto);

      const foundMachine = await prismaService.machine.findFirst({
        where: {
          name: 'any_name'
        }
      });

      expect(foundMachine).toBeTruthy();
      expect(foundMachine).toEqual(result.data);

    });

    it('Deve lançar um erro quando já existe uma máquina com o mesmo nome', async () => {
      await prismaService.machine.create({ data: makeSut().createMachinePrisma });

      try {
        await machineService.create({ name: 'any_name' } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Já existe uma máquina com este nome.');
      }
    });
  });

  describe('findAll', () => {
    it('Deve listar todas as máquinas', async () => {
      await prismaService.machine.create({ data: makeSut().createMachinePrisma });

      const result = await machineService.findAll({});

      expect(result.data.length).toBe(1);
      expect(result.data[0]).toEqual(makeSut().createMachinePrisma);
    });

    it('Deve retornar erro ao não encontrar nenhuma máquina', async () => {
      try {
        await machineService.findAll({});
        fail();
      } catch (error) {
        expect(error.message).toBe('Máquina não encontrada.');
      }
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma máquina', async () => {
      await prismaService.machine.create({ data: makeSut().createMachinePrisma });

      const result = await machineService.findOne('any_id');

      expect(result.data).toEqual(makeSut().createMachinePrisma);
    });

    it('Deve retornar erro ao não encontrar uma máquina', async () => {
      try {
        await machineService.findOne('any_id');
      } catch (error) {
        expect(error.message).toBe('Máquina não encontrada.');
      }
    });
  });

  describe('updateStatus', () => {
    it('Deve atualizar o status da máquina', async () => {
      await prismaService.machine.create({ data: makeSut().createMachinePrisma });

      const result = await machineService.updateStatus('any_id', { status: EStatus.OPERATING } as any);

      const foundMachine = await prismaService.machine.findFirst({
        where: {
          id: 'any_id'
        }
      });

      expect(result.data).toEqual(makeSut().createMachinePrisma);
      expect(foundMachine.status).toBe(EStatus.OPERATING);
    });

    it('Deve retornar erro ao não encontrar uma máquina', async () => {
      try {
        await machineService.updateStatus('any_id', { status: EStatus.OPERATING } as any);
        fail();
      } catch (error) {
        expect(error.message).toBe('Máquina não encontrada.');
      }
    });

    it('Deve retornar erro ao tentar atualizar o status para o mesmo status', async () => {
      await prismaService.machine.create({ data: makeSut().createMachinePrisma });

      try {
        await machineService.updateStatus('any_id', { status: EStatus.OFF } as any);
        fail();
      } catch (error) {
        expect(error.message).toBe('O status informado é igual ao anterior.');
      }
    });
  });

  describe('updateLocation', () => {
    it('Deve atualizar a localização da máquina', async () => {
      await prismaService.machine.create({ data: makeSut().createMachinePrisma });

      const result = await machineService.updateLocation('any_id', { location: 'any_location_other' } as any);
      const foundMachine = await prismaService.machine.findFirst({
        where: {
          id: 'any_id'
        }
      });

      expect(result.data).toEqual({
        ...makeSut().createMachinePrisma,
        location: 'any_location_other'
      });
      expect(foundMachine.location).toBe('any_location_other');
    });
    it('Deve retornar erro ao não encontrar uma máquina', async () => {
      try {
        await machineService.updateLocation('any_id', { location: 'any_location_other' } as any);
        fail();
      } catch (error) {
        expect(error.message).toBe('Máquina não encontrada.');
      }
    });
  });

  describe('remove', () => {
    it('Deve remover uma máquina', async () => {
      await prismaService.machine.create({ data: makeSut().createMachinePrisma });

      const result = await machineService.remove('any_id');

      expect(result.data).toBe('Máquina removida com sucesso!');
      const foundMachine = await prismaService.machine.findFirst({
        where: {
          id: 'any_id'
        }
      });

      expect(foundMachine).toBeNull();
    });

    it('Deve retornar erro ao não encontrar uma máquina', async () => {
      try {
        await machineService.remove('any_id');
        fail();
      } catch (error) {
        expect(error.message).toBe('máquina não encontrada.');
      }
    });
  });
});
