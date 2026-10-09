import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  password?: string;
  emailVerified?: boolean;
  photoURL?: string;
  provider?: string;
  providerData: {
    providerId: string;
    uid: string;
  }[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
      default: null,
    },
    displayName: {
      type: String,
      trim: true,
      default: null,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    photoURL: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      default: 'email',
    },
    providerData: {
      type: [
        {
          providerId: String,
          uid: String,
        },
      ],
      default: [],
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);