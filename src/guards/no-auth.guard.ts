import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthException } from "../exceptions/auth.exception";

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const auth = this.reflector.get<boolean>("auth", context.getHandler());
    if (auth) return true;
    const user = context.switchToHttp().getRequest().user;
    if (user) throw new AuthException("/user");
    return true;
  }
}
