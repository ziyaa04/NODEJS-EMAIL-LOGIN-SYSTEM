import { IsEmail, Length } from "class-validator";

export class LoginDto {
  _token: string;

  @IsEmail(
    {},
    {
      message: "Email format is invalid!",
    }
  )
  email: string;

  @Length(8, 20, {
    message: "Password length must be between 8 and 20",
  })
  password: string;

  remember?: boolean;
}
