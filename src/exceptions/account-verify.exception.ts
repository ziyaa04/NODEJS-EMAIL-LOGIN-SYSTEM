import { ForbiddenException } from "@nestjs/common";

export class AccountVerifyException extends ForbiddenException {
  constructor(public readonly redirectPath: string) {
    super();
  }
}
