import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { AccountVerifyException } from "../exceptions/account-verify.exception";
import { Response } from "express";

@Catch(AccountVerifyException)
export class AccountVerifyExceptionFilter implements ExceptionFilter {
  catch(exception: AccountVerifyException, host: ArgumentsHost): any {
    const res = host.switchToHttp().getResponse<Response>();
    res.redirect(exception.redirectPath);
  }
}
