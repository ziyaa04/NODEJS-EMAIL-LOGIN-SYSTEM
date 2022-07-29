import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from "@nestjs/common";
import { ValidationException } from "../exceptions/validation.exception";
import { Response, Request } from "express";

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly renderPath: string) {}

  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const body = ctx.getRequest<Request>().body;
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.locals.data = body;
    res.locals.errors = this.formatErrors(exception.messages);
    res.locals._token = req.cookies._token;
    res.cookie("_token", req.cookies._token);
    res.locals = { ...res.locals,...exception.data };
    return res.render(this.renderPath);
  }

  private formatErrors(ValidationErrors: ValidationError[]): object {
    const errors = {};

    for (const validationError of ValidationErrors) {
      const keys = Object.keys(validationError.constraints);
      errors[validationError.property] = [];
      for (const key of keys) {
        errors[validationError.property].push(validationError.constraints[key]);
      }
    }

    return { ...errors };
  }
}
