import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

/**
 * Documentação sobre este padrão de exceção: https://docs.nestjs.com/exception-filters#catch-everything
 *
 * @export
 * @class CustomExceptionFilter
 * @implements {ExceptionFilter}
 */

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || 'Erro interno. Tente novamente mais tarde.';

    if (exception instanceof PrismaClientKnownRequestError) {
      message = `Erro interno. Tente novamente mais tarde. - Error: ${exception.code}`;
    }

    response.status(statusCode).json({
      code: statusCode,
      success: false,
      error: {
        message,
        details: exception.response?.invalidFields,
        process: exception.stack,
      },
    });
  }
}
