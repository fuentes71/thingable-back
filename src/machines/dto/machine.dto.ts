import { PartialType } from '@nestjs/swagger';


export class CreateMachineDto {}

export class UpdateMachineDto extends PartialType(CreateMachineDto) {}