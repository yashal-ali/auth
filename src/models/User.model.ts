import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
  [key: string]: any;
}

const defaultSchemaFields: Record<string, any> = {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyCode: { type: String },
  verifyCodeExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
};

let customFields: Record<string, any> = {};

export const extendUserSchema = (fields: Record<string, any>) => {
  customFields = fields;
};

const UserSchema = new Schema<IUser>(
  { ...defaultSchemaFields, ...customFields },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
