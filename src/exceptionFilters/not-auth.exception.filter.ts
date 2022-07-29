import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { NotAuthException } from "../exceptions/not-auth.exception";
import { Response } from "express";

@Catch(NotAuthException)
export class NotAuthExceptionFilter implements ExceptionFilter {
  catch(exception: NotAuthException, host: ArgumentsHost): any {
    const res = host.switchToHttp().getResponse<Response>();
    return res.redirect(exception.redirectUrl);
  }
}
