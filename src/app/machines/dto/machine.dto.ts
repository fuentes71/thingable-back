import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EStatus } from 'src/shared/enums';

import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length, ValidateIf } from 'class-validator';

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
  @ApiProperty()
  @IsString({ message: 'O nome da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da máquina é obrigatório.' })
  name: string;
}

export class UpdateMachineDto extends PartialType(CreateMachineDto) { }

export class UpdateMachineStatusDto {
  @ApiProperty()
  @IsString({ message: 'O status da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O status da máquina é obrigatório.' })
  @IsEnum(EStatus, { message: 'O status da máquina deve ser um dos seguintes: OFF, OPERATING, MAINTENANCE_STOP.' })
  status: EStatus;
}

export class UpadteMachineLocationDto {
  @ApiProperty()
  @IsString({ message: 'A localização deve ser uma string.' })
  @IsNotEmpty({ message: 'A localização é obrigatória.' })
  location: string;
}

export class QueryFilter {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'page deve ser um valor positivo.' })
  @IsInt({ message: 'page deve ser um número inteiro.' })
  page: number = 1;

  @ApiProperty({ default: 50, required: false })
  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'pageSize deve ser um valor positivo.' })
  @IsInt({ message: 'pageSize deve ser um número inteiro.' })
  pageSize: number = 50;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString({ message: 'A pesquisa da máquina deve ser uma string.' })
  @Length(2, 255, { message: 'A pesquisa da máquina deve ter entre 2 e 255 caracteres.' })
  @ValidateIf((obj, value) => value !== undefined)
  @IsEnum(EStatus, { message: 'O status da máquina deve ser um dos seguintes: OFF, OPERATING, MAINTENANCE_STOP' })
  search?: string;
}