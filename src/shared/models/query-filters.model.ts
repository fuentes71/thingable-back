import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class QueryFilters {
  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'page deve ser um valor positivo.' })
  @IsInt({ message: 'page deve ser um número inteiro.' })
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value = Number(value)))
  @IsPositive({ message: 'pageSize deve ser um valor positivo.' })
  @IsInt({ message: 'pageSize deve ser um número inteiro.' })
  pageSize: number = 50;
}
