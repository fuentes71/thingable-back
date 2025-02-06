import { ConflictException, Injectable } from '@nestjs/common';
import { ICustomResponseService } from 'src/shared/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMachineDto, MachineDto, UpdateMachineDto } from './dto';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) { }
  async create(createMachineDto: CreateMachineDto): Promise<ICustomResponseService<MachineDto>> {

    const foundMachine = await this.prisma.machine.findFirst({
      where: {
        name: createMachineDto.name,
        delete_at: null
      }
    })
    if (foundMachine) throw new ConflictException('Já existe uma máquina com este nome');

    try {
      const CreatedMachine = await this.prisma.machine.create({ data: createMachineDto });

      return { data: CreatedMachine };
    } catch (error) {
      throw error;
    }
  }

async  findAll(): Promise<ICustomResponseService<MachineDto[]>> {
    try {
      const foundMachines = await this.prisma.machine.findMany({
        where: {
          delete_at: null
        }
      });

      if (!foundMachines) throw new ConflictException('Nenhuma máquina encontrada');
      
      return { data: foundMachines };
    } catch (error) {
      throw error;
    }
  }

 async findOne(id: string): Promise<ICustomResponseService<MachineDto>> {
    try {
      const foundMachine = await this.prisma.machine.findFirst({
        where: {
          id,
          delete_at: null
        }
      });

      if (!foundMachine) throw new ConflictException('Nenhuma máquina encontrada');

      return { data: foundMachine };
    } catch (error) {
      throw error;
    }
  }

  update(id: string, updateMachineDto: UpdateMachineDto) {
    return `This action updates a #${id} machine`;
  }

  remove(id: string) {
    return `This action removes a #${id} machine`;
  }
}
