import { Router, Request, Response } from 'express';
import passport from 'passport';
import { authController } from './auth.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { authLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', requireAuth, authController.logout);

router.get(
  '/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/connexion?error=google_auth_failed`,
  }),
  authController.googleRedirect,
);

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const { userService } = await import('../user/user.service');
  const user = await userService.findById((req as any).user.userId);
  if (!user) {
    res.status(404).json({ error: 'Utilisateur introuvable.' });
    return;
  }
  res.json({ user: (user as any).toSafeJSON() });
});

export default router;
