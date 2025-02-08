import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateMachineDto, QueryFilterMachines, UpadteMachineLocationDto, UpdateMachineStatusDto } from './dto';

import { createMachineResponse } from 'src/swagger';
import { MachinesService } from './machines.service';

@ApiTags('Máquinas')
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) { }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova máquina.' })
  @ApiResponse(createMachineResponse[201])
  @ApiResponse(createMachineResponse[400])
  @ApiResponse(createMachineResponse[409])
  create(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todas as máquinas.' })

 async findAll(@Query() queryParams?: QueryFilterMachines) {
  const machines = await this.machinesService.findAll(queryParams);
  return machines;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma máquina.' })
  findOne(@Param('id') id: string) {
    return this.machinesService.findOne(id);
  }

  @Put('status/:id')
  @ApiOperation({ summary: 'Atualizar o status de uma máquina.' })
  updateStatus(@Param('id') id: string, @Body() updateMachineStatusDto: UpdateMachineStatusDto) {
    return this.machinesService.updateStatus(id, updateMachineStatusDto);
  }

  @Put('location/:id')
  @ApiOperation({ summary: 'Atualizar a localização de uma máquina.' })
  updateLocation(@Param('id') id: string, @Body() updateMachineLocationDto: UpadteMachineLocationDto) {
    return this.machinesService.updateLocation(id, updateMachineLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma máquina.' })
  remove(@Param('id') id: string) {
    return this.machinesService.remove(id);
  }
}
