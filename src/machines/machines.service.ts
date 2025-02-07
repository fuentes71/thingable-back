import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ICustomResponseService } from 'src/shared/interfaces';
import { QueryFilters } from 'src/shared/models';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMachineDto, MachineDto, UpdateMachineDto } from './dto';
import { machine, Prisma } from '@prisma/client';
import { EStatus } from 'src/shared/enums';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

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

  constructor(private prisma: PrismaService) { }
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
      const CreatedMachine = await this.prisma.machine.create({ data: createMachineDto });

      return { data: this.mapToDto(CreatedMachine) };
    } catch (error) {
      throw error;
    }
  }

  async findAll(queryParams: QueryFilters): Promise<ICustomResponseService<MachineDto[]>> {
    const { page, pageSize, search } = queryParams;
    try {
      const skip = (page - 1) * pageSize;

      let processedSearch: string | undefined;

      if (search) {
        processedSearch = search.trim();

        if (/['";]/.test(processedSearch)) throw new BadRequestException('Termo de busca inválido.');
      }

      const searchFilter = search
        ? {
          OR: [
            { status: { equals: processedSearch as EStatus } }]
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

      const machines = foundMachines.map(machine => {
        return this.mapToDto(machine);
      });

      return {
        data: machines,
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

  async update(id: string, updateMachineDto: UpdateMachineDto): Promise<ICustomResponseService<MachineDto>> {
    const foundMachine = await this.prisma.machine.findFirst({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!foundMachine) throw new ConflictException('Nenhuma máquina encontrada.');

    if (updateMachineDto === foundMachine) throw new ConflictException('Nenhuma informação nova foi passada para alterar.');

    try {
      const updatedMachine = await this.prisma.machine.update({
        where: {
          id
        },
        data: updateMachineDto
      });

      if (updatedMachine.status !== foundMachine.status) {
        console.log(updatedMachine.status);
        this.client.emit(
          'machine-event',
          JSON.stringify({
            event: 'update-status',
            id,
            updatedMachine,
            timestamp: new Date(),
          }),
        );
      }

      return { data: this.mapToDto(updatedMachine) };

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
