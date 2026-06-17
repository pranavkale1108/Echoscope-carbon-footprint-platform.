import jwt from 'jsonwebtoken';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. Missing or malformed Authorization token.' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify token using jsonwebtoken
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to req object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error(`[Auth Middleware Error] Verification failed: ${error.message}`);
    return res.status(401).json({ error: 'Access denied. Invalid or expired authentication token.' });
  }
};

