import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Length, ValidateIf } from 'class-validator';

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
  @IsString({ message: 'A pesquisa da notificação deve ser uma string.' })
  @Length(2, 255, { message: 'A pesquisa da notificação deve ter entre 2 e 255 caracteres.' })
  @ValidateIf((obj, value) => value !== undefined)
  search?: string;
}
