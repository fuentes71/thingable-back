import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { machine } from '@prisma/client';
import { Partitioners } from 'kafkajs';
import { EStatus } from 'src/shared/enums';
import { ICustomResponseService } from 'src/shared/interfaces';
import { CreateMachineDto, MachineDto, QueryFilterMachines, UpadteMachineLocationDto, UpdateMachineStatusDto } from './dto';
import { EventsService } from '../events/events.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MachinesService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_URL],
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_ID,
        allowAutoTopicCreation: true,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  })
  private client: ClientKafka;
  private requestPatterns = ['machine-event'];

  constructor(
    private prisma: PrismaService,
    private event: EventsService
  ) { }
  async onModuleInit(): Promise<void> {
    this.requestPatterns.map(async pattern => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  async create(createMachineDto: CreateMachineDto): Promise<ICustomResponseService<MachineDto>> {

    const foundMachine = await this.prisma.machine.findFirst({
      where: {
        name: createMachineDto.name,
        deleted_at: null
      }
    });

    if (foundMachine) throw new ConflictException('Já existe uma máquina com este nome.');

    try {
      const CreatedMachine = await this.prisma.machine.create({
        data: {
          name: createMachineDto.name,
          location: '',
          status: EStatus.OFF,
        }
      });

      if (!CreatedMachine) throw new ConflictException('Nenhuma máquina foi criada.');

      await this.event.create({ machineId: CreatedMachine.id });

      return { data: this.mapToDto(CreatedMachine) };
    } catch (error) {
      throw error;
    }
  }

  async findAll(queryParams: QueryFilterMachines): Promise<ICustomResponseService<MachineDto[]>> {
    const { page, pageSize, search } = queryParams;
    try {
      const skip = (page - 1) * pageSize;

      let processedSearch: EStatus | undefined;

      if (search) {
        processedSearch = search.trim() as EStatus;

        if (!Object.values(EStatus).includes(processedSearch)) throw new BadRequestException('Status inválido.');
      }

      const searchFilter = search
        ? {
          status: { equals: processedSearch }
        }
        : {};

      const count = await this.prisma.machine.count({
        where: {
          deleted_at: null,
          ...searchFilter
        }
      });

      const totalPages = Math.ceil(count / pageSize);

      if (page > totalPages && totalPages > 0) throw new NotFoundException('Página não encontrada.');

      if (!totalPages) throw new NotFoundException('Nenhuma máquina encontrada para a página solicitada.');

      const foundMachines = await this.prisma.machine.findMany({
        take: pageSize,
        skip: skip,
        orderBy: {
          name: 'asc',
        },
        where: {
          deleted_at: null,
          ...searchFilter,
        },
      });

      if (!foundMachines) throw new ConflictException('Nenhuma máquina encontrada.');

      return {
        data: foundMachines.map(machine => this.mapToDto(machine)),
        currentPage: page,
        pageSize,
        totalCount: count,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ICustomResponseService<MachineDto>> {
    try {
      const foundMachine = await this.prisma.machine.findFirst({
        where: {
          id,
          deleted_at: null
        }
      });

      if (!foundMachine) throw new ConflictException('Nenhuma máquina encontrada.');

      return { data: this.mapToDto(foundMachine) };
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string, updateMachineStatusDto: UpdateMachineStatusDto): Promise<ICustomResponseService<MachineDto>> {
    const foundMachine = await this.prisma.machine.findFirst({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!foundMachine) throw new ConflictException('Nenhuma máquina encontrada.');

    if (foundMachine.status === updateMachineStatusDto.status) throw new ConflictException('O status informado é igual ao anterior.');

    try {
      const updateMachine = await this.prisma.machine.update({
        where: {
          id
        },
        data: {
          status: updateMachineStatusDto.status
        }
      });

      this.client.emit(
        'machine-event',
        JSON.stringify({
          event: 'update-status-event',
          id,
          updateMachine,
          timestamp: new Date(),
        }),
      );

      return { data: this.mapToDto(updateMachine) };
    } catch (error) {
      throw error;
    }
  }

  async updateLocation(id: string, upadteMachineLocationDto: UpadteMachineLocationDto): Promise<ICustomResponseService<MachineDto>> {
    const foundMachine = await this.prisma.machine.findFirst({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!foundMachine) throw new ConflictException('Nenhuma máquina encontrada.');

    try {
      const updateMachine = await this.prisma.machine.update({
        where: {
          id
        },
        data: {
          location: upadteMachineLocationDto.location
        }
      });

      return { data: this.mapToDto(updateMachine) };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<ICustomResponseService<string>> {
    const foundMachine = await this.prisma.machine.findFirst({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!foundMachine) throw new ConflictException('Nenhuma máquina encontrada.');

    try {
      const removedMachine = await this.prisma.machine.update({
        where: {
          id
        },
        data: {
          deleted_at: new Date()
        }
      });

      if (removedMachine) return { data: 'Máquina removida com sucesso!' };
    } catch (error) {
      throw error;
    }
  }


  private mapToDto(machine: machine): MachineDto {
    return {
      id: machine.id,
      name: machine.name,
      location: machine.location,
      status: machine.status as EStatus
    }
  }
}
