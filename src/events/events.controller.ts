import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateEventDto, QueryFilterEvents } from './dto';

import { MessagePattern } from '@nestjs/microservices';
import { EventsService } from './events.service';

@ApiTags('Eventos')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @MessagePattern('update-status-event')

  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(@Query() queryParams: QueryFilterEvents) {
    return this.eventsService.findAll(queryParams);
  }

}
