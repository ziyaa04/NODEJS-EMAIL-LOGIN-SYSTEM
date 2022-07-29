import { UnauthorizedException } from "@nestjs/common";

export class NotAuthException extends UnauthorizedException {
  constructor(public readonly redirectUrl: string) {
    super();
  }
}
