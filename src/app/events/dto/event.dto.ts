import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { QueryFilters } from 'src/shared/models';

export class CreateEventDto {
  @IsString({ message: 'O id da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O id da máquina é obrigatório.' })
  machineId: string;
}

export class QueryFilterEvents extends QueryFilters {
  @IsOptional()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString({ message: 'O id da máquina deve ser uma string.' })
  @Length(2, 255, { message: 'O id da máquina deve ter entre 2 e 255 caracteres.' })
  @IsNotEmpty({ message: 'O id da máquina é obrigatória.' })
  search?: string;
}