import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
@ValidatorConstraint({ name: "Match" })
export class MatchValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    const [property] = validationArguments.constraints;
    return validationArguments.object[property] === value;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Confirm password is not equal to the password!`;
  }
}
