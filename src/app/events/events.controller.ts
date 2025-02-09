import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateEventDto, QueryFilter } from './dto';

import { MessagePattern } from '@nestjs/microservices';
import { EventsService } from './events.service';

@ApiTags('Eventos')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos os eventos.' })
  findAll(@Query() queryParams: QueryFilter) {
    return this.eventsService.findAll(queryParams);
  }

  @MessagePattern('machine-event')
  create(@Body() createEventDto: CreateEventDto) {
    console.log('aaaaaaaaa', createEventDto);
    return this.eventsService.create(createEventDto);
  }
}
