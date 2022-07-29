import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { NotAuthException } from "../exceptions/not-auth.exception";
import { User } from "../schemas/user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuth = this.reflector.get<boolean>("no-auth", context.getHandler());
    if (noAuth) return true;
    const user: User = context.switchToHttp().getRequest().user;
    //console.log(user);
    if (!user) throw new NotAuthException("/auth/login");

    return true;
  }
}
