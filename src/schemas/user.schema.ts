import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({
    default:
      'https://www.pngitem.com/pimgs/m/421-4213053_default-avatar-icon-hd-png-download.png',
  })
  avatarUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
