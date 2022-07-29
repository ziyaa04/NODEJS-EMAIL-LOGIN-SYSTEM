import { registerDecorator, ValidationOptions } from "class-validator";
import { MatchValidator } from "../match.validator";

export const Match =
  (property: string, validationOptions?: ValidationOptions) =>
  (object: any, propertyName: string) => {
    registerDecorator({
      name: "Match",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchValidator,
    });
  };
