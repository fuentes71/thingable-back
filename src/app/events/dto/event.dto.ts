import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString({ message: 'O id da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O id da máquina é obrigatório.' })
  machineId: string;
}

export class QueryFilter {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'page deve ser um valor positivo.' })
  @IsInt({ message: 'page deve ser um número inteiro.' })
  page?: number = 1;

  @ApiProperty({ default: 50, required: false })
  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'pageSize deve ser um valor positivo.' })
  @IsInt({ message: 'pageSize deve ser um número inteiro.' })
  pageSize?: number = 50;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString({ message: 'O id da máquina deve ser uma string.' })
  @Length(2, 255, { message: 'O id da máquina deve ter entre 2 e 255 caracteres.' })
  @IsNotEmpty({ message: 'O id da máquina é obrigatória.' })
  search?: string;
}