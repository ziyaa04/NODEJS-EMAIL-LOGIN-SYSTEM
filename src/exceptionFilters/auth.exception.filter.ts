import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { AuthException } from "../exceptions/auth.exception";
import { Response } from "express";

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException, host: ArgumentsHost): any {
    const res = host.switchToHttp().getResponse<Response>();
    return res.redirect(exception.redirectUrl);
  }
}
