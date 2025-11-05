import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const signToken=(payload, opts = {})=> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: opts.expiresIn || '15m' });
}

export const verifyToken=(req,res,next) =>{
  try {
    const token = req.headers.authorization.split(' ')[1]||"";
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

export const cekAuth=(req,res,next) =>{
  try {
    const token = req.headers.authorization.split(' ')[1]||"";
    // console.log("token cekAuth",token)
    if (!token) {
      console.error("unauthenticated, token = ",token);
      return res.status(400).json({
        message:"Unauthorized"
      })
    }

    jwt.verify(token, JWT_SECRET);

    return res.status(200).json()
  } catch (err) {
    console.error("error cekauth",err)
    // Handle token expired error
    if (err.name === 'TokenExpiredError') {
      return res.status(404).json({
        message: "Token expired",
        expiredAt: err.expiredAt
      });
    }

    // Handle other JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({
        message: "Invalid token"
      });
    }

    // Handle other errors
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}