import jwt from 'jsonwebtoken';
import { cookieOptions } from './cookieOptions.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const signToken=(payload, opts = {})=> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: opts.expiresIn || '7d' });
}

export const verifyToken=(token) =>{
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// --- Middleware ---
export const requireAuth=(req, res, next)=> {
  const token = req.user;
  if (!token) {
    console.error("unauthenticated");
    // No cookie -> not authenticated
    return res.status(400).json();
  }
  const payload = verifyToken(token);
  if (!payload) {
    console.error("unauthorized");
    // invalid or expired token
    // clear cookie to be safe
    res.clearCookie('token', cookieOptions);
    return res.status(400).json();
  }
  // attach user info to req for handlers
  req.user = payload;
  next();
}