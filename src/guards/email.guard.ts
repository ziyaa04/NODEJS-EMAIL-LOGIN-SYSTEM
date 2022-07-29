import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AccountVerifyException } from "../exceptions/account-verify.exception";
import { User } from "../schemas/user.schema";

@Injectable()
export class EmailGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const noEmail = this.reflector.get<boolean>(
      "no-email",
      context.getHandler()
    );

    if (noEmail) return true;

    const user: User = context.switchToHttp().getRequest().user;
    if (!user.isVerified)
     throw new AccountVerifyException("/user/send-verify-mail");

    return true;
  }
}
