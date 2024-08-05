import {
  BadGatewayException,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { ZodError } from 'zod';
import { ErrorType } from '../types';

interface ErrorHandler {
  handle(error: Error): Observable<never>;
}

class HttpErrorHandler implements ErrorHandler {
  handle(error: Error) {
    return throwError(() => error);
  }
}

class ZodErrorHandler implements ErrorHandler {
  handle(error: Error) {
    return throwError(
      () =>
        new BadRequestException({
          error: ErrorType.INVALID,
          message: 'Invalid input data',
        }),
    );
  }
}

class PrismaErrorHandler implements ErrorHandler {
  handle(error) {
    if (error.constructor.name === 'PrismaClientKnownRequestError') {
      switch (error.code) {
        case 'P2002':
          return throwError(
            () =>
              new BadRequestException({
                error: ErrorType.DUPPLICATE,
                message: 'Duplicate entry',
              }),
          );
        case 'P2025':
          return throwError(
            () =>
              new BadRequestException({
                error: ErrorType.INVALID,
                message: 'Invalid input data',
              }),
          );
        default:
          return throwError(() => new BadGatewayException('Prisma error'));
      }
    } else if (error.constructor.name === 'PrismaClientUnknownRequestError') {
      return throwError(
        () =>
          new BadGatewayException({
            error: ErrorType.UNKNOWN,
            message: error.message,
          }),
      );
    } else if (error.constructor.name === 'PrismaClientValidationError') {
      return throwError(
        () =>
          new BadRequestException({
            error: ErrorType.INVALID,
            message: "Invalid query data or query doesn't exist",
          }),
      );
    }
    return throwError(() => new BadGatewayException());
  }
}

class DefaultErrorHandler implements ErrorHandler {
  handle(error: Error) {
    return throwError(() => new BadGatewayException());
  }
}

class ErrorHandlerFactory {
  static getHandler(error: Error) {
    console.log(error);
    if (error instanceof ZodError) {
      return new ZodErrorHandler();
    } else if (
      error.constructor.name === 'PrismaClientKnownRequestError' ||
      error.constructor.name === 'PrismaClientUnknownRequestError' ||
      error.constructor.name === 'PrismaClientValidationError'
    ) {
      return new PrismaErrorHandler();
    } else if (error.constructor.name === 'HttpException') {
      return new HttpErrorHandler();
    } else {
      return new DefaultErrorHandler();
    }
  }
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: Error) => {
        console.log(error);
        const handler = ErrorHandlerFactory.getHandler(error);
        return handler.handle(error);
      }),
    );
  }
}