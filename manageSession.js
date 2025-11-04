import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const signToken=(payload, opts = {})=> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: opts.expiresIn || '15m' });
}

export const verifyToken=(req,res,next) =>{
  try {
    const token = req.headers.authorization||"";
    if (!token) {
      console.error("unauthenticated, token = ",token);
      return res.status(400).json({
        message:"Unauthorized"
      })
    }

    const authorized = jwt.verify(token, JWT_SECRET);

    if (!authorized) {
      console.error("unauthorized, token = ",token);
      return res.status(400).json({
        message:"Unauthorized"
      })
    }

    next()
  } catch (err) {
    return null;
  }
}