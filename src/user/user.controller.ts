import {
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../guards/auth.guard";
import { NotAuthExceptionFilter } from "../exceptionFilters/not-auth.exception.filter";
import { Request, Response } from "express";
import { EmailGuard } from "../guards/email.guard";
import { AccountVerifyExceptionFilter } from "../exceptionFilters/account-verify.exception.filter";
import { NoEmail } from "../decorators/no-email.decorator";
import { User } from "../schemas/user.schema";
import { MailException } from "../exceptions/mail.exception";
import { MailExceptionFilter } from "../exceptionFilters/mail.exception.filter";
import { NoMailGuard } from "../guards/no-mail.guard";

@Controller("user")
@UseGuards(AuthGuard, EmailGuard)
@UseFilters(new NotAuthExceptionFilter(), new AccountVerifyExceptionFilter(),new MailExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render("user/index")
  Index() {
    return this.userService.Index();
  }

  @Get("send-verify-mail")
  @Render("user/send-verify-mail")
  @NoEmail()
  @UseGuards(NoMailGuard)
  SendVerifyMail() {
    return this.userService.sendVerifyMail();
  }

  @Post("send-verify-mail")
  @Render('user/send-verify-mail')
  @NoEmail()
  @UseGuards(NoMailGuard)
  sendVerifyMailPOST(
    @Req() req: Request & { user: User},
    @Res({ passthrough: true }) res: Response
  ) {

    return this.userService.sendVerifyMailPOST(req, res);
  }

  @Post("logout")
  @Redirect("/")
  @NoEmail()
  Logout(@Res({ passthrough: true }) res: Response) {
    return this.userService.Logout(res);
  }
}
