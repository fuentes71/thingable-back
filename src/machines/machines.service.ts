import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICustomResponseService } from 'src/shared/interfaces';
import { QueryFilters } from 'src/shared/models';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMachineDto, MachineDto, UpdateMachineDto } from './dto';
import { machine, Prisma } from '@prisma/client';
import { EStatus } from 'src/shared/enums';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) { }
  async create(createMachineDto: CreateMachineDto): Promise<ICustomResponseService<MachineDto>> {

    const foundMachine = await this.prisma.machine.findFirst({
      where: {
        name: createMachineDto.name,
        deleted_at: null
      }
    })
    if (foundMachine) throw new ConflictException('Já existe uma máquina com este nome');

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

      let isNumeric = false;
      let processedSearch: string | undefined;

      if (search) {
        processedSearch = search.trim();

        isNumeric = /^\d+$/.test(processedSearch);

        if (/['";]/.test(processedSearch)) throw new BadRequestException('Termo de busca inválido.');

      }

      const searchFilter = search
        ?
        { name: { contains: processedSearch, mode: Prisma.QueryMode.insensitive } }
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
      name: machine.name,
      location: machine.location,
      status: machine.status as EStatus
    }
  }
}
