import { Module } from '@nestjs/common';
import { TelemetryGateway } from './telemetry.gateway';
import { MachinesService } from '../machines/machines.service';

@Module({
  providers: [TelemetryGateway, MachinesService],
  exports: [TelemetryGateway],
})
export class TelemetryModule {}
