import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class ValidationException extends BadRequestException {
  constructor(public readonly messages: ValidationError[],public readonly  data?) {
    super();
  }

  static generateValidationError(target, property, constraints) {
    const validationError = new ValidationError();

    validationError.target = target;
    validationError.property = property;
    validationError.value = target[property];
    validationError.constraints = constraints;
    return validationError;
  }
}
