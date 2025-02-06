import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress;
    const payload = req.body ? JSON.stringify(req.body) : 'No payload';

    const now = Date.now();

    this.logger.log(`Method: ${method} | URL: ${url} | IP: ${ip} | User-Agent: ${userAgent} | Payload: ${payload}`);

    return next.handle().pipe(
      tap(() => {
        const status = context.switchToHttp().getResponse().statusCode;
        const time = Date.now() - now;
        this.logger.log(`Completed ${method} ${url} with status ${status} in ${time}ms`);
      }),
      catchError(error => {
        const time = Date.now() - now;
        this.logger.error(`Error in ${method} ${url} after ${time}ms - IP: ${ip}`, error.stack);
        return throwError(() => error);
      }),
    );
  }
}
