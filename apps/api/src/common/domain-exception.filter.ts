import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../consent/consent.service';
import { DomainAuthError } from '../auth/auth.service';

/**
 * Sérialise les erreurs de domaine et d'auth en RFC 7807 (problem+json).
 * Ne divulgue JAMAIS d'information interne (anti-énumération, minimisation).
 */
@Catch(DomainError, DomainAuthError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError | DomainAuthError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    const status = mapToHttp(exception);

    const body = {
      type: 'about:blank',
      title: exception.message,
      status,
      code: exception.code,
    };

    // Anti-fuite : pas de stacktrace, pas de détail interne.
    if (!res.headersSent) {
      res.status(status).json(body);
    } else {
      // Si les headers sont déjà envoyés, on délègue au handler par défaut.
      const fallback = new HttpException(exception.message, status);
      fallback.message = exception.message;
      throw fallback;
    }
  }
}

function mapToHttp(err: DomainError | DomainAuthError): number {
  switch (err.code) {
    case 'CHILD_NOT_FOUND':
    case 'ERR_NOT_FOUND':
      return HttpStatus.NOT_FOUND;
    case 'ERR_FORBIDDEN':
      return HttpStatus.FORBIDDEN;
    case 'ERR_AGE':
    case 'INVALID_TRANSITION':
    case 'ERR_PARENT':
      return HttpStatus.UNPROCESSABLE_ENTITY;
    case 'ERR_REGISTER':
    case 'ERR_TOKEN':
      // Status unique pour éviter d'aider l'énumération.
      return HttpStatus.UNAUTHORIZED;
    default:
      return HttpStatus.BAD_REQUEST;
  }
}
