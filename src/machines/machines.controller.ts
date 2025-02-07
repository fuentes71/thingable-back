import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QueryFilters } from 'src/shared/models';
import { CreateMachineDto, UpadteMachineLocationDto, UpdateMachineStatusDto } from './dto';

import { MachinesService } from './machines.service';

@ApiTags('Máquinas')
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) { }

  @Post()
  create(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Get()
  findAll(@Query() queryParams?: QueryFilters) {
    return this.machinesService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machinesService.findOne(id);
  }

  @Put('status/:id')
  updateStatus(@Param('id') id: string, @Body() updateMachineStatusDto: UpdateMachineStatusDto) {
    return this.machinesService.updateStatus(id, updateMachineStatusDto);
  }
  @Put('location/:id')
  updateLocation(@Param('id') id: string, @Body() updateMachineLocationDto: UpadteMachineLocationDto) {
    return this.machinesService.updateLocation(id, updateMachineLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machinesService.remove(id);
  }
}
