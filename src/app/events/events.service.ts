import { Injectable, NotFoundException } from '@nestjs/common';
import { event, machine } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { ICustomResponseService, IEvent } from 'src/shared/interfaces';
import { CreateEventDto, QueryFilter } from './dto';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService) { }
  
  async create(createEventDto: CreateEventDto): Promise<ICustomResponseService<string>> {
    try {
      const createdEvent = await this.prisma.event.create({
        data: { machine_id: createEventDto.machineId },
      });

      if (!createdEvent) throw new NotFoundException('Não foi possível cadastrar o evento.');

      return { data: 'Evento criado com sucesso!' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(queryParams: QueryFilter): Promise<ICustomResponseService<IEvent[]>> {
    const { page, pageSize, search } = queryParams;
    try {
      const skip = (page - 1) * pageSize;

      const searchFilter = search
        ? {
          machine_id: { equals: search.trim() }
        }
        : {};

      const [count, foundEvents] = await this.prisma.$transaction([
        this.prisma.event.count({
          where: {
            ...searchFilter
          }
        }),
        this.prisma.event.findMany({
          take: pageSize,
          skip: skip,
          where: {
            ...searchFilter,
          },
          include: { machine: true },
        }),
      ]);

      if (page > Math.ceil(count / pageSize) && count > 0) throw new NotFoundException('Página não encontrada.');

      if (!count) throw new NotFoundException('Máquina não encontrada para a página solicitada.');

      if (!foundEvents) throw new NotFoundException('Não foi possível encontrar os eventos.');

      const events: IEvent[] = foundEvents.map(this.mapToEntity.bind(this));

      return { data: events, currentPage: page, pageSize, totalCount: count, totalPages: Math.ceil(count / pageSize) };
    } catch (error) {
      throw error;
    }
  }

  private mapToEntity(entity: event & { machine: machine }): IEvent {
    return {
      machineId: entity.machine_id,
      machine: entity.machine.name,
      status: entity.machine.status,
      location: entity.machine.location,
      timestamp: entity.machine.updated_at
    };
  }
}
