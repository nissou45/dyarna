import bcrypt from 'bcrypt';
import { User, IUser } from '../user/user.model';

interface UserDocument extends IUser {
  toSafeJSON(): Omit<IUser, 'passwordHash' | 'refreshTokenHash'>;
}
import { RegisterDto, LoginDto } from './auth.dto';
import { AppError } from '../../utils/AppError';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  compareRefreshToken,
} from '../../utils/tokens';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await User.findOne({ email: dto.email });
    if (existing) {
      throw new AppError('Cet email est déjà utilisé.', 409);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await User.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
    });

    const tokens = this.generateTokens(user._id.toString(), user.role);
    await this.storeRefreshToken(user._id.toString(), tokens.refreshToken);

      return {
        user: user.toSafeJSON(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(dto: LoginDto) {
    return new Promise<{
      user: Omit<IUser, 'passwordHash' | 'refreshTokenHash'>;
      accessToken: string;
      refreshToken: string;
    }>((resolve, reject) => {
      passport.authenticate(
        'local',
        { session: false },
        async (err: Error | null, user: UserDocument | false, info: { message: string }) => {
          if (err) return reject(err);
          if (!user) {
            return reject(new AppError('Email ou mot de passe incorrect.', 401));
          }

          try {
            const tokens = this.generateTokens(user._id.toString(), user.role);
            await this.storeRefreshToken(user._id.toString(), tokens.refreshToken);
            resolve({
              user: user.toSafeJSON(),
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            });
          } catch (error) {
            reject(error);
          }
        },
      )( { body: dto } as Request, {} as Response, () => {} );
    });
  }

  async refresh(token: string) {
    const user = await User.findOne({ refreshTokenHash: { $exists: true } }).select(
      '+refreshTokenHash',
    );

    if (!user || !user.refreshTokenHash) {
      throw new AppError('Refresh token invalide.', 401);
    }

    const isValid = compareRefreshToken(token, user.refreshTokenHash);
    if (!isValid) {
      user.refreshTokenHash = undefined;
      await user.save();
      throw new AppError('Refresh token invalide.', 401);
    }

    const tokens = this.generateTokens(user._id.toString(), user.role);
    await this.storeRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: '' } });
  }

  private generateTokens(userId: string, role: string) {
    const accessToken = generateAccessToken({ userId, role: role as 'user' | 'admin' });
    const refreshToken = generateRefreshToken();
    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string) {
    const hashed = hashRefreshToken(token);
    await User.findByIdAndUpdate(userId, { refreshTokenHash: hashed });
  }
}

export const authService = new AuthService();
