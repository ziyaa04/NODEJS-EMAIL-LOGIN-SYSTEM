import { Length } from "class-validator";
import { Match } from "../../validators/decorators/match.decorator";

export class ChangePasswordDto{
  _token: string;

  @Length(8,20,{
    message: 'Password length must be between 8 and 20'
  })
  password: string;
  @Match('password')
  confirm_password: string;
}