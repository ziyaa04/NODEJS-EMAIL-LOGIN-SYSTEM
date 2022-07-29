import { UnauthorizedException } from "@nestjs/common";

export class AuthException extends UnauthorizedException {
  constructor(public readonly redirectUrl: string) {
    super();
  }
}
