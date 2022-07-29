import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";
import { AppModule } from "../app.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/user.schema";

@Module({
  imports: [
    JwtModule,
    forwardRef(() => AppModule),
    MongooseModule.forFeature([ { name: User.name, schema: UserSchema } ])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
