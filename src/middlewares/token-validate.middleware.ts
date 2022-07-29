import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class TokenValidateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any {
    if (req.body._token !== req.cookies._token) return res.redirect("404");

    next();
  }
}
