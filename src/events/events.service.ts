import { Injectable, NotFoundException } from '@nestjs/common';
import { event, machine } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { ICustomResponseService, IEvent } from 'src/shared/interfaces';
import { CreateEventDto, QueryFilterEvents } from './dto';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService) { }
  async create(createEventDto: CreateEventDto): Promise<ICustomResponseService<string>> {
    try {
      const createdEvent = await this.prisma.event.create({
        data: { machine_id: createEventDto.machineId },
      });

      if (!createdEvent) throw new Error('Não foi possível cadastrar o evento.');

      return { data: 'Evento criado com sucesso!' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(queryParams: QueryFilterEvents): Promise<ICustomResponseService<IEvent[]>> {
    const { page, pageSize, search } = queryParams;
    try {
      const skip = (page - 1) * pageSize;

      const searchFilter = search
        ? {
          machine_id: { equals: search.trim() }
        }
        : {};

      const count = await this.prisma.event.count({
        where: {
          ...searchFilter
        }
      });

      const totalPages = Math.ceil(count / pageSize);

      if (page > totalPages && totalPages > 0) throw new NotFoundException('Página não encontrada.');

      if (!totalPages) throw new NotFoundException('Nenhuma máquina encontrada para a página solicitada.');

      const foundEvents = await this.prisma.event.findMany({
        take: pageSize,
        skip: skip,
        where: {
          ...searchFilter,
        },
        include: { machine: true },
      });


      if (!foundEvents) throw new Error('Não foi possível encontrar os eventos.');

      const events: IEvent[] = foundEvents.map(this.mapToEntity.bind(this));

      return { data: events };
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
