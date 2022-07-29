import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { DbException } from "../exceptions/db.exception";
import { Request, Response } from "express";

@Catch(DbException)
export class DbExceptionFilter implements ExceptionFilter {
  catch(exception: DbException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    res.locals.error = exception.errorMessage;
    res.locals._token = req.cookies._token;
    res.locals = { ...res.locals,...exception.data};
    return res.render(exception.renderPath);
  }
}
