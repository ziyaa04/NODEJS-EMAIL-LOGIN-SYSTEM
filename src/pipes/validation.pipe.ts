import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";
import { TokenService } from "../helpers/token.service";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly tokenService: TokenService) {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if(metadata.type !== 'body')
      return value;
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);
    if (errors.length) {
      throw new ValidationException(errors);
    }
    return value;
  }
}
