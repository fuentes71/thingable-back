import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { EStatus } from 'src/shared/enums';

export class CreateEventDto {
  @IsString({ message: 'O id da máquina deve ser uma string.' })
  @IsNotEmpty({ message: 'O id da máquina é obrigatório.' })
  machineId: string;
}

