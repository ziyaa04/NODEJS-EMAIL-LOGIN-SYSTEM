import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import CreateEnvConfig from "./configs/env.config";
import { TokenGenerateMiddleware } from "./middlewares/token-generate.middleware";
import { TokenService } from "./helpers/token.service";
import { UserModule } from "./user/user.module";
import { MailerModule } from "@nestjs-modules/mailer";
import MailerConfig from "./configs/mailer.config";
import { MongooseModule } from "@nestjs/mongoose";
import { TokenValidateMiddleware } from "./middlewares/token-validate.middleware";
import { JwtMiddleware } from "./middlewares/jwt.middleware";
import DbConfig from "./configs/db.config";
import { MailService } from "./helpers/mail.service";
import { HttpExceptionFilter } from "./exceptionFilters/http.exception.filter";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [
    ConfigModule.forRoot(CreateEnvConfig()),
    MailerModule.forRoot(MailerConfig()),
    MongooseModule.forRoot(DbConfig()),
    MongooseModule.forFeature([{ name:User.name, schema: UserSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    TokenService,
    MailService,
  ],
  exports: [TokenService, MailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // generate token
    consumer.apply(TokenGenerateMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.GET,
    });

    // validate token
    consumer.apply(TokenValidateMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.POST,
    });

    // jwt
    consumer.apply(JwtMiddleware).forRoutes("*");
  }
}
