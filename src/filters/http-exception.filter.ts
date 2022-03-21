import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();
    const error = exception.getResponse();

    if(request.headers['accept'].startsWith('text/html')) { 
      response.render('error', {...error as any});
    } else {
      const statusCode = exception.getStatus();
      response.status(statusCode).json(error);
    }
  }
}