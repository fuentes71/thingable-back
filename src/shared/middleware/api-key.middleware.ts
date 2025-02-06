import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  private readonly apiKey = process.env.API_KEY;

  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== this.apiKey || !apiKey) {
      throw new UnauthorizedException(
        'A rota solicitada não está autorizada para acesso com a chave de API fornecida.',
      );
    }

    next();
  }
}
