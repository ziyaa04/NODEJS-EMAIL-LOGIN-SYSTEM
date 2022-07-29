import { Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose";
import { ValidationException } from "../exceptions/validation.exception";
import { SignUpDto } from "./dto/sign-up.dto";
import * as crypto from "crypto";
import { DbException } from "../exceptions/db.exception";
import { v4 as uuidv4 }  from 'uuid';
import { MailService } from "../helpers/mail.service";
import { MailException } from "../exceptions/mail.exception";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  login() {
    return {};
  }

  async loginPOST(res: Response, loginDto: LoginDto) {
    try {
      const user: User = await this.userModel.findOne({ email: loginDto.email });

      if (!user) {
        const validationError = ValidationException.generateValidationError(
          loginDto,
          "email",
          { notExists: "User is not exists!" }
        );
        throw new ValidationException([validationError]);
      }
      // is right password
      const pass = crypto.createHash("sha256").update(loginDto.password).digest("hex");
      if (user.password !== pass) {
        const validationError = ValidationException.generateValidationError(
          loginDto,
          "password",
          { notExists: "Password is wrong !" }
        );
        throw new ValidationException([validationError]);
      }


      // create token
      const { email, isVerified } = user;

      const jwt = this.jwtService.sign({ email, isVerified  }, {
        expiresIn: loginDto.remember ? "365d" : process.env.JWT_EXPIRES_IN,
      });

      res.cookie("jwt", jwt);
    } catch (e) {
      if (e instanceof ValidationException) throw e;
      // throw db error
      throw new DbException("auth/login");
    }
    return {};
  }

  signUp() {
    return {};
  }

  async signUpPOST(res: Response, signUpDto: SignUpDto) {
    try {
      const exists = await this.userModel.findOne({ email: signUpDto.email });

      if (exists) {
        const validationError = ValidationException.generateValidationError(
          signUpDto,
          "email",
          { isExists: "User already exists!" }
        );
        throw new ValidationException([validationError]);
      }

      const user: User = await this.userModel.create({
        email: signUpDto.email,
        password: crypto
          .createHash("sha256")
          .update(signUpDto.password)
          .digest("hex"),
        verifyHash: uuidv4(),
        changePasswordHash: uuidv4()
      });

      if (!user) {
        // throw db error
        throw new DbException("auth/sign-up");
      }

      const { email, isVerified } = user;
      res.cookie("jwt", this.jwtService.sign({ email, isVerified }));


    } catch (e) {
      if (e instanceof ValidationException) throw e;
      // throw db error
      throw new DbException("auth/sign-up");
    }
    return {};
  }

  async verifyMail(hash: string, res: Response) {
    try{
      const user: User = await this.userModel.findOneAndUpdate({ verifyHash: hash },{ $set: { isVerified: true, verifyHash: '' }})
      if(!user)
        throw new NotFoundException();

      res.cookie('jwt', this.jwtService.sign({ email: user.email, isVerified: true }));
      return { success: 'Your account has been verified!' };
    }catch(e)
    {
      if(e instanceof NotFoundException)
        throw e;
      throw new DbException('auth/verify-mail','Something went wrong please try again later!');
    }
  }

  forgetPassword()
  {

    return { };
  }

  async forgetPasswordPOST(req: Request, res: Response)
  {
    res.locals._token = req.cookies._token;
    // check last mail time
    if(!this.mailService.checkLastMailTime(req.cookies.lastMailTime))
      throw MailException.BadMailException('Wait 1-2 minutes before sending again!','auth/forget-password');
    try{
      // check is exists user
      const user: UserDocument = await this.userModel.findOne({ email: req.body.email });

      if(!user)
      {
        // throw not exists user error
        const ValidationError = ValidationException.generateValidationError(req.body,'email',{ email: 'Email is not exists!' });
        throw new ValidationException([ValidationError]);
      }
      // send mail
      const url = `${process.env.SITE_URL}/auth/change-password/${user.changePasswordHash}`;
      const isSend = await this.mailService.sendChangePasswordMail(user.email,url);
      if(!isSend)
         throw MailException.InternalMailException('We have some trouble with sending mails','auth/forget-password');
      // set new last mail time
      res.cookie('lastMailTime',Date.now().toString());
      return { _token: req.cookies._token, success: 'Change password link has been sent!' };
    }catch(e)
    {
      if(e instanceof ValidationException)
        throw e;
    }

  }

  async changePassword(req: Request)
  {
    try{
      const user = await this.userModel.findOne({ changePasswordHash: req.params.hash });
      if(!user)
        throw new NotFoundException();

      return {  hash: req.params.hash  };
    }catch(e)
    {
      if(e instanceof NotFoundException)
        throw e;
      throw new DbException('auth/change-password','Something went wrong !',{ hash: req.params.hash });
    }

  }

  async changePasswordPOST(req: Request)
  {
    try{
      const user = await this.userModel.findOneAndUpdate({ changePasswordHash: req.params.hash },{
        $set: {
          password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
          changePasswordHash : uuidv4()
        }
      });

      if(!user)
      {
        const validationError = ValidationException.generateValidationError(req.body,'password',{ wrong: 'Something went wrong!' });
        throw new ValidationException([validationError]);
      }



    }catch(e)
    {
      if(e instanceof ValidationException)
        throw e;
      throw new DbException('auth/change-password','Something went wrong !');
    }

    return {  _token: req.cookies._token, success: 'Password has been changed!' };
  }





}
