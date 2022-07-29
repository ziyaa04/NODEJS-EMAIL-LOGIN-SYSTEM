import { HttpException } from "@nestjs/common";

export class MailException extends HttpException {
  constructor(
    message: string,
    status: number,
    public readonly renderPath: string
  ) {
    super(message, status);
  }

  static BadMailException(message: string, renderPath: string) {
    return new MailException(message, 400, renderPath);
  }

  static InternalMailException(message: string, renderPath: string) {
    return new MailException(message, 500, renderPath);
  }
}
