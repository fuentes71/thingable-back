import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Length, ValidateIf } from 'class-validator';
import { EStatus } from '../enums';

export class QueryFilters {
  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'page deve ser um valor inteiro e positivo.' })
  @IsInt({ message: 'page deve ser um número inteiro.' })
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'pageSize deve ser um valor inteiro e positivo.' })
  @IsInt({ message: 'pageSize deve ser um número inteiro.' })
  pageSize: number = 50;

  @IsOptional()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString({ message: 'A pesquisa da máquina deve ser uma string.' })
  @Length(2, 255, { message: 'A pesquisa da máquina deve ter entre 2 e 255 caracteres.' })
  @ValidateIf((obj, value) => value !== undefined)
  @IsEnum(EStatus, { message: 'O status da máquina deve ser um dos seguintes: OFF, OPERATING, MAINTENANCE_STOP' })
  search?: string;
}
