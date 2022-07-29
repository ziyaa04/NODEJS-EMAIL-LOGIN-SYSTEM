import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    isRequired: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    isRequired: true,
    min: 8,
    max: 20,
  })
  password: string;

  @Prop({
    default: false,
  })
  isVerified: boolean;

  @Prop()
  verifyHash: string;

  @Prop()
  changePasswordHash: string;


  @Prop({
    default: () => new Date().toUTCString(),
  })
  updatedAt: string;

  @Prop({
    immutable: true,
    default: () => new Date().toUTCString(),
  })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
