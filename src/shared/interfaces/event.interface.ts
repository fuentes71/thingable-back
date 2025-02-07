export interface IEvent {
  machineId: string;
  machine: string;
  status: string;
  location: string;
  timestamp: string | Date;
}