import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction } from 'express';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { EStatus } from 'src/shared/enums';
import request from 'supertest';

import { CreateMachineDto, UpadteMachineLocationDto, UpdateMachineStatusDto } from './dto';
import { MachinesService } from './machines.service';

const makeSut = () => {
  const responseMachine = {
    id: 'any_id',
    name: 'any_name',
    location: null,
    status: EStatus.OFF
  };

  const createMachineDto: CreateMachineDto = {
    name: 'any_name',
  };

  const findAllMachines = [
    {
      id: 'any_id',
      name: 'any_name',
      location: null,
      status: EStatus.OFF
    },
    {
      id: 'any_id_other',
      name: 'any_name_other',
      location: null,
      status: EStatus.OFF
    }
  ];

  const updateMachineStatusOperatingDto: UpdateMachineStatusDto = {
    status: EStatus.OPERATING
  };

  const updateMachineStatusMaintenanceStopDto: UpdateMachineStatusDto = {
    status: EStatus.MAINTENANCE_STOP
  };

  const updateMachineStatusOffDto: UpdateMachineStatusDto = {
    status: EStatus.OFF
  };

  const updateMachineLocationDto: UpadteMachineLocationDto = {
    location: 'any_location'
  };

  return {
    responseMachine,
    createMachineDto,
    findAllMachines,
    updateMachineStatusOperatingDto,
    updateMachineStatusMaintenanceStopDto,
    updateMachineStatusOffDto,
    updateMachineLocationDto
  };
}

describe('MachinesController', () => {
  const path = '/machines'
  let machineService: MachinesService;
  let app: INestApplication;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [MachinesService, PrismaService, ConfigService],
    }).compile();

    machineService = module.get<MachinesService>(MachinesService);
    app = module.createNestApplication();

    app.use((req: Request, res: Response, next: NextFunction) => {
      req.headers['x-api-key'] = process.env.API_KEY;
      next();
    });

    await app.init();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(machineService).toBeDefined();
  });

  describe('create', () => {
    it('Deve criar uma máquina', async () => {

      jest.spyOn(machineService, 'create').mockResolvedValue({ data: makeSut().responseMachine } as any);

      const response = await request(app.getHttpServer())
        .post(path)
        .send({ data: makeSut().createMachineDto });

      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });

    it('Deve retornar um erro de conflito ao tentar criar uma máquina com um nome ja existente', async () => {
      jest.spyOn(machineService, 'create').mockRejectedValue(new Error('Já existe uma máquina com este nome.'));

      const response = await request(app.getHttpServer())
        .post(path)
        .send({ data: makeSut().createMachineDto });

      expect(response.statusCode).toBe(HttpStatus.CONFLICT);
    });

    it('Deve retornar um erro de validação ao tentar criar uma máquina com nome vazio', async () => {
      const response = await request(app.getHttpServer())
        .post(path)
        .send({ data: makeSut().createMachineDto });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });
  describe('findAll', () => {
    it('Deve listar todas as maquinas', async () => {
      jest.spyOn(machineService, 'findAll').mockResolvedValue({ data: makeSut().findAllMachines } as any);

      const response = await request(app.getHttpServer())
        .get(path);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual(makeSut().findAllMachines);
    });

    it('Deve retornar um erro ao tentar listar todas as maquinas', async () => {
      jest.spyOn(machineService, 'findAll').mockRejectedValue(new Error('Máquina não encontrada.'));

      const response = await request(app.getHttpServer())
        .get(path);

      expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma máquina', async () => {
      jest.spyOn(machineService, 'findOne').mockResolvedValue({ data: makeSut().responseMachine } as any);

      const response = await request(app.getHttpServer())
        .get(`${path}/any_id`);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual(makeSut().responseMachine);
    });

    it('Deve retornar um erro 404 ao tentar encontrar uma máquina inexistente', async () => {
      jest.spyOn(machineService, 'findOne').mockRejectedValue(new Error('Máquina inexistente.'));

      const response = await request(app.getHttpServer())
        .get(`${path}/any_id`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('remove', () => {
    it('Deve remover uma máquina', async () => {
      jest.spyOn(machineService, 'remove').mockResolvedValue({ data: 'Máquina removida com sucesso!' } as any);

      const response = await request(app.getHttpServer())
        .delete(`${path}/any_id`);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body.data).toEqual('Máquina removida com sucesso!');
    });

    it('Deve retornar um erro 404 ao tentar remover uma máquina inexistente', async () => {
      jest.spyOn(machineService, 'remove').mockRejectedValue(new Error('máquina não encontrada.'));

      const response = await request(app.getHttpServer())
        .delete(`${path}/any_id`);      

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
