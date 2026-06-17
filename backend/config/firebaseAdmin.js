import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
export const isFirebaseAdminConfigured = fs.existsSync(serviceAccountPath);

if (isFirebaseAdminConfigured) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[Firebase Admin] Initialized successfully.');
  } catch (error) {
    console.error('[Firebase Admin Error] Failed to initialize:', error.message);
  }
} else {
  console.log('[Firebase Admin Warning] serviceAccountKey.json not found. Server running in Auth Bypass Mode.');
}

export default admin;
