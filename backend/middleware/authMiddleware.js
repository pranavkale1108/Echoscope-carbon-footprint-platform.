import admin, { isFirebaseAdminConfigured } from '../config/firebaseAdmin.js';

export const requireAuth = async (req, res, next) => {
  // Bypassed authentication mode if Firebase Admin is not configured
  if (!isFirebaseAdminConfigured) {
    req.user = {
      uid: 'EcoGuardian_Offline_UID',
      email: 'trial_user@echoscope.earth',
      name: 'EcoGuardian'
    };
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. Missing or malformed Authorization token.' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach decoded token user info to req object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0]
    };
    
    next();
  } catch (error) {
    console.error(`[Auth Middleware Error] Verification failed: ${error.message}`);
    return res.status(401).json({ error: 'Access denied. Invalid or expired authentication token.' });
  }
};
