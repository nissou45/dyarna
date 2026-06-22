import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  googleId?: string;
  displayName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  refreshTokenHash?: string;
  createdAt: Date;
}

interface IUserMethods {
  toSafeJSON(): Omit<IUser, 'passwordHash' | 'refreshTokenHash'>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ googleId: 1 }, { sparse: true });

userSchema.pre('validate', function (next) {
  if (!this.passwordHash && !this.googleId) {
    this.invalidate(
      'passwordHash',
      'User must have either passwordHash or googleId',
    );
  }
  next();
});

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokenHash;
  return obj;
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
