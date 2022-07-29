import { Injectable, NestMiddleware } from "@nestjs/common";
import { TokenService } from "../helpers/token.service";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class TokenGenerateMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  use(req: Request, res: Response, next: NextFunction): any {
    const _token = this.tokenService.generateToken(30);
    res.cookie("_token", _token, { httpOnly: true });
    res.locals._token = _token;
    next();
  }
}
