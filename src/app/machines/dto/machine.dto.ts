import { PartialType } from '@nestjs/swagger';
import { EStatus } from 'src/shared/enums';

import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { QueryFilters } from 'src/shared/models';

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
}

export class UpdateMachineDto extends PartialType(CreateMachineDto) { }

export class UpdateMachineStatusDto {
  @IsString({ message: 'O status da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O status da máquina é obrigatório.' })
  @IsEnum(EStatus, { message: 'O status da máquina deve ser um dos seguintes: OFF, OPERATING, MAINTENANCE_STOP.' })
  status: EStatus;
}

export class UpadteMachineLocationDto {
  @IsString({ message: 'A localização deve ser uma string.' })
  @IsNotEmpty({ message: 'A localização é obrigatória.' })
  location: string;
}

export class QueryFilterMachines extends QueryFilters{
  @IsOptional()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString({ message: 'A pesquisa da máquina deve ser uma string.' })
  @Length(2, 255, { message: 'A pesquisa da máquina deve ter entre 2 e 255 caracteres.' })
  @ValidateIf((obj, value) => value !== undefined)
  @IsEnum(EStatus, { message: 'O status da máquina deve ser um dos seguintes: OFF, OPERATING, MAINTENANCE_STOP' })
  search?: string;
}