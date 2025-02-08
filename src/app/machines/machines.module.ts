import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { EventsService } from 'src/events/events.service';

@Module({
  controllers: [MachinesController],
  providers: [MachinesService, EventsService],
})
export class MachinesModule { }
