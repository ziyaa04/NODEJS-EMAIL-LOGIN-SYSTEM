import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

export default () => ({
  transport: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Boolean(process.env.MAIL_SECURE),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  defaults: {
    from: `${process.env.SITE_URL}  <${process.env.MAIL_USER}>`,
  },
  template: {
    dir: process.cwd() + "/views/mail/",
    adapter: new EjsAdapter(),
    options: {
      strict: false,
    },
  },
});
