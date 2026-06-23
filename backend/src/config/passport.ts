import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { User, IUser } from '../modules/user/user.model';
import { env } from './env';

passport.serializeUser((user: any, done) => {
  // Express.User n'a pas `_id`, `any` est le workaround standard
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', session: false },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
        if (!user || !user.passwordHash) {
          return done(null, false, { message: 'Email ou mot de passe incorrect.' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return done(null, false, { message: 'Email ou mot de passe incorrect.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email returned from Google'), undefined);
        }

        const googleId = profile.id;
        const displayName = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value;

        let user = await User.findOne({ $or: [{ email }, { googleId }] });

        if (user) {
          if (!user.googleId && googleId) {
            user.googleId = googleId;
            if (avatarUrl) user.avatarUrl = avatarUrl;
            await user.save();
          }
        } else {
          user = await User.create({
            email,
            googleId,
            displayName,
            avatarUrl,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    },
  ),
);

export default passport;
