import {
  Body,
  Controller,
  Get, Param,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Response, Request } from "express";
import { ValidationPipe } from "../pipes/validation.pipe";
import { ValidationExceptionFilter } from "../exceptionFilters/validation.exception.filter";
import { NoAuthGuard } from "../guards/no-auth.guard";
import { SignUpDto } from "./dto/sign-up.dto";
import { DbExceptionFilter } from "../exceptionFilters/db.exception.filter";
import { AuthExceptionFilter } from "../exceptionFilters/auth.exception.filter";
import { Auth } from "../decorators/auth.decorator";
import { VerifyMailDto } from "./dto/verify-mail.dto";
import { MailExceptionFilter } from "../exceptionFilters/mail.exception.filter";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller("auth")
@UseFilters(new DbExceptionFilter(), new AuthExceptionFilter(), new MailExceptionFilter())
@UsePipes(ValidationPipe)
@UseGuards(NoAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Get("login")
  @Render("auth/login")
  login() {
    return this.authService.login();
  }

  @Post("login")
  @Redirect("/user")
  @UseFilters(new ValidationExceptionFilter("auth/login"))
  loginPOST(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() user: LoginDto
  ) {
    return this.authService.loginPOST(res, user);
  }

  @Get("sign-up")
  @Render("auth/sign-up")
  signUp() {
    return this.authService.signUp();
  }

  @Post("sign-up")
  @Redirect("/user/")
  @UseFilters(new ValidationExceptionFilter("auth/sign-up"))
  signUpPOST(@Res({ passthrough: true }) res, @Body() signUpDto: SignUpDto) {
    return this.authService.signUpPOST(res, signUpDto);
  }

  @Get('verify-mail/:hash')
  @Render('auth/verify-mail')
  @Auth()
  verifyMail(@Param() params: VerifyMailDto, @Res() res: Response) {
    return this.authService.verifyMail(params.hash, res);
  }

  @Get('forget-password')
  @Render('auth/forget-password')
  forgetPassword() {

    return this.authService.forgetPassword();
  }

  @Post('forget-password')
  @Render('auth/forget-password')
  @UseFilters(new ValidationExceptionFilter('auth/forget-password'))
  async forgetPasswordPOST(@Req() req: Request, @Res() res: Response) {
    return this.authService.forgetPasswordPOST(req, res);
  }


  @Get('change-password/:hash')
  @Render('auth/change-password')
  changePassword(@Req() req: Request) {
    return this.authService.changePassword(req);
  }

  @Post('change-password/:hash')
  @Render('auth/change-password')
  @UseFilters(new ValidationExceptionFilter('auth/change-password'))
  changePasswordPOST(@Req() req: Request, @Body() body: ChangePasswordDto) {
    console.log('Worked!');
    return this.authService.changePasswordPOST(req);
  }
}