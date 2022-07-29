import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerifyMail(to: string, url: string) {
    return await this.mailerService.sendMail({
      to,
      subject: "Verify Mail",
      template: "verify",
      context: {
        url
      },
    });
  }

  async sendChangePasswordMail(to: string, url: string) {
    return await this.mailerService.sendMail({
      to,
      subject: "Change Password",
      template: "change-password",
      context: {
        url
      },
    });
  }
  checkLastMailTime(lastMailTime: string): boolean {
    if(!lastMailTime)
      return true;
    const diff =
       Number.parseInt(Date.now().toString()) - Number.parseInt(lastMailTime) ;
    const passTime = diff / 1000;
    if (passTime > 60) return true;
    return false;
  }
}
