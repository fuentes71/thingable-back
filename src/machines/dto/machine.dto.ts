import { PartialType } from '@nestjs/swagger';
import { EStatus } from 'src/shared/enums';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MachineDto {
  @IsOptional()
  @IsNotEmpty({ message: 'O id da máquina é obrigatório.' })
  id?: string;

  @IsString({ message: 'O nome da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da máquina é obrigatório.' })
  name: string;

  @IsString({ message: 'A localização deve ser uma string.' })
  @IsNotEmpty({ message: 'A localização é obrigatória.' })
  location: string;

  @IsString({ message: 'O status da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O status da máquina é obrigatório.' })
  @IsEnum(EStatus, { message: 'O status da máquina deve ser um dos seguintes: OFF, OPERATING, MAINTENANCE_STOP.' })
  status: EStatus;
}

export class CreateMachineDto {
  @IsString({ message: 'O nome da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da máquina é obrigatório.' })
  name: string;

  @IsString({ message: 'A localização deve ser uma string.' })
  @IsNotEmpty({ message: 'A localização é obrigatória.' })
  location: string;

  @IsNotEmpty({ message: 'O status da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O status da máquina é obrigatório.' })
  @IsEnum(EStatus, { message: 'O status da máquina deve ser um dos seguintes: OFF, OPERATING, MAINTENANCE_STOP.' })
  status: EStatus;
}

export class UpdateMachineDto extends PartialType(CreateMachineDto) { }