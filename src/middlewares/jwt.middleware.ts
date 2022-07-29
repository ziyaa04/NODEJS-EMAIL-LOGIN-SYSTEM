import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Mode } from "fs";
import { Model } from "mongoose";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService,@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const jwt = req.cookies.jwt;
      if (!jwt) return next();

      const userJwt = this.jwtService.verify(jwt, {
        secret: process.env.JWT_SECRET,
      });
      const user =  await this.userModel.findOne({ email: userJwt.email });

      req["user"] = user;
    } catch (e) {
      return next();
    }

    next();
  }
}
