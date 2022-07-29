import { InternalServerErrorException } from "@nestjs/common";

export class DbException extends InternalServerErrorException {
  constructor(
    public readonly renderPath,
    public readonly errorMessage = "Something went worong!",
    public data?: object
  ) {
    super();
  }
}
