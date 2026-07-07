import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Catches every error so the client receives a meaningful message instead of a
 * bare "Internal server error". This is especially important on serverless
 * (Vercel) where the platform logs are hard to reach — surfacing the real
 * cause (e.g. a database connection failure) turns a dead end into something
 * the user can actually act on.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json(this.normalize(exception.getResponse()));
      return;
    }

    const message =
      exception instanceof Error ? exception.message : String(exception);
    const code =
      exception && typeof exception === 'object' && 'code' in exception
        ? (exception as { code?: string }).code
        : undefined;

    this.logger.error(
      `${request.method} ${request.url} -> ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: this.friendly(message, code),
      code,
    });
  }

  private normalize(body: string | object) {
    return typeof body === 'string' ? { message: body } : body;
  }

  private friendly(message: string, code?: string): string {
    const dbHints = [
      'connect',
      'ECONNREFUSED',
      'database',
      'DATABASE_URL',
      'prisma',
      'does not exist',
      'protocol',
    ];
    const looksLikeDb =
      (code && code.startsWith('P')) ||
      dbHints.some((hint) =>
        message.toLowerCase().includes(hint.toLowerCase()),
      );

    if (looksLikeDb) {
      return `Database error: ${message}. Verify the DATABASE_URL environment variable points to a reachable Postgres database and that migrations have been deployed.`;
    }

    return message || 'Something went wrong. Please try again.';
  }
}
