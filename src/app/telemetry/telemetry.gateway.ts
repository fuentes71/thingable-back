import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IMachine } from 'src/shared/interfaces';
import { MachinesService } from '../machines/machines.service';
import { EStatus } from 'src/shared/enums';
import { faker } from '@faker-js/faker';

@WebSocketGateway()
export class TelemetryGateway {
  private machines: IMachine[] = [];

  constructor(private machineService: MachinesService) {
    this.machineService.findAll({}).then((res) => {
      this.machines = res.data;
    });
  }

  @SubscribeMessage('cron-job-event')
  async updateLocation() {
    await Promise.all(this.machines.map(async (machine) => {
      let locationFake;

      if (machine.status === EStatus.OPERATING) {
        locationFake = machine.location;

        const location = locationFake ? faker.location.nearbyGPSCoordinate({
          origin: [
            parseFloat(locationFake.split(',')[0]),
            parseFloat(locationFake.split(',')[1])
          ],
          radius: 50
        }) : faker.location.nearbyGPSCoordinate();
        
        const [latitude, longitude] = location;

        await this.machineService.updateLocation(machine.id, { location: `${latitude},${longitude}` });
      }
    }));
  }
}
