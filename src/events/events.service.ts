import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICustomResponseService, IEvent } from 'src/shared/interfaces';
import { event, machine } from '@prisma/client';

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

  async findAll(): Promise<ICustomResponseService<IEvent[]>> {

    try {
      const foundEvents = await this.prisma.event.findMany({
        include: { machines: true },
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
