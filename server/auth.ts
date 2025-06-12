import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import type { Express } from 'express';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface OAuthProfile {
  id: string;
  emails?: { value: string }[];
  name?: { givenName?: string; familyName?: string };
  photos?: { value: string }[];
  displayName?: string;
  username?: string;
}

// Session configuration
export function setupSession(app: Express) {
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: 7 * 24 * 60 * 60, // 7 days
    tableName: 'sessions',
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

// Passport configuration
export function setupPassport() {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `https://${process.env.REPLIT_DOMAINS}/auth/google/callback`
      : "http://localhost:5000/auth/google/callback"
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const userId = `google_${profile.id}`;
      const email = profile.emails?.[0]?.value;
      const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0];
      const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ');
      const profileImageUrl = profile.photos?.[0]?.value;

      // Create session user object without storing in database
      const sessionUser = {
        id: userId,
        email,
        firstName,
        lastName,
        profileImageUrl,
        provider: 'google',
        providerId: profile.id,
      };
      
      return done(null, sessionUser);
    } catch (error) {
      return done(error, false);
    }
  }));

  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `https://${process.env.REPLIT_DOMAINS}/auth/github/callback`
      : "http://localhost:5000/auth/github/callback"
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const userId = `github_${profile.id}`;
      const email = profile.emails?.[0]?.value;
      const firstName = profile.displayName?.split(' ')[0] || profile.username;
      const lastName = profile.displayName?.split(' ').slice(1).join(' ') || '';
      const profileImageUrl = profile.photos?.[0]?.value;

      // Create session user object without storing in database
      const sessionUser = {
        id: userId,
        email,
        firstName,
        lastName,
        profileImageUrl,
        provider: 'github',
        providerId: profile.id,
      };
      
      return done(null, sessionUser);
    } catch (error) {
      return done(error, false);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      
      done(null, user || null);
    } catch (error) {
      done(error, null);
    }
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}