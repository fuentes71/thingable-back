import { ICustomResponseService } from './custom-response-service.interface';

export interface ICustomResponseInterceptor extends ICustomResponseService<any> {
  success: boolean;
  code: number;
  data: any;
}
