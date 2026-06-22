import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authService } from './auth.service';
import { registerSchema, loginSchema } from './auth.dto';
import { setRefreshCookie } from '../../utils/tokens';
import { env } from '../../config/env';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const dto = registerSchema.parse(req.body);
    const result = await authService.register(dto);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const dto = loginSchema.parse(req.body);
    const result = await authService.login(dto);
    setRefreshCookie(res, result.refreshToken);
    res.json({
      user: result.user,
      accessToken: result.accessToken,
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = (req as any).cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ error: 'Refresh token manquant.' });
      return;
    }
    const result = await authService.refresh(token);
    setRefreshCookie(res, result.refreshToken);
    res.json({ accessToken: result.accessToken });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (user) {
      await authService.logout(user.userId);
    }
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ message: 'Déconnecté.' });
  }),

  googleRedirect: asyncHandler(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = (req as any).authInfo;
    setRefreshCookie(res, refreshToken);
    const redirectUrl = new URL('/connexion', env.FRONTEND_URL);
    redirectUrl.searchParams.set('token', accessToken);
    redirectUrl.searchParams.set('user', JSON.stringify(user));
    res.redirect(redirectUrl.toString());
  }),
};
