import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { MailService } from "../helpers/mail.service";
import { MailException } from "../exceptions/mail.exception";
import { User, UserDocument } from "../schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DbException } from "../exceptions/db.exception";

@Injectable()
export class UserService {
  constructor(
    private readonly mailService: MailService,
    @InjectModel(User.name) private  userModel: Model<UserDocument>
  ) {}

  Index() {
    return {};
  }

  sendVerifyMail() {
    return {};
  }

  async sendVerifyMailPOST(req: Request & { user: User }, res: Response) {

    if (!this.mailService.checkLastMailTime(req.cookies.lastMailTime))
      throw MailException.BadMailException(
        "Wait 1-2 minutes before sending again !",
        "user/send-verify-mail"
      );

    try {
      const user = await this.userModel.findOne({ email: req.user.email });

      if(!user)
        throw new DbException('user/send-verify-mail','Something went wrong!');

      const url = `${process.env.SITE_URL}/auth/verify-mail/${user.verifyHash}`;
      const sendMail = await this.mailService.sendVerifyMail(
        user.email,
        url
      );

      if (!sendMail) throw new Error();

      res.cookie("lastMailTime", Date.now().toString(),{ httpOnly: true });
    } catch (e) {
      throw MailException.InternalMailException(
        "We have some trouble with sending mail, please try again later",
        "user/send-verify-mail"
      );
    }

    return { success: 'Verify-link has been sent!',_token:req.cookies._token };
  }

  Logout(res: Response) {
    res.clearCookie("jwt");
    return {};
  }


}
