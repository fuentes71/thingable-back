import { EStatus } from "../enums";

export interface IMachine{
  id: string;
  name: string;
  location: string;
  status: EStatus
}