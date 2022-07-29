import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "../schemas/user.schema";
import { AccountVerifyException } from "../exceptions/account-verify.exception";

@Injectable()
export class NoMailGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const user: User = context.switchToHttp().getRequest().user;
    if(user.isVerified)
      throw new AccountVerifyException('/user');

    return true;
  }
}
