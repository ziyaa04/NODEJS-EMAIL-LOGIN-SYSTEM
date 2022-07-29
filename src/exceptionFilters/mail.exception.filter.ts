import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { MailException } from "../exceptions/mail.exception";
import { Request, Response } from "express";

@Catch(MailException)
export class MailExceptionFilter implements ExceptionFilter{
  catch(exception: MailException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    return res.render(exception.renderPath,{ error: exception.message, _token: req.cookies._token });
  }
}