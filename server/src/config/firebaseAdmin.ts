/**
 * Firebase Admin SDK Configuration
 * 
 * Initializes Firebase Admin for server-side operations.
 * Supports both service account file and emulator modes.
 */

import admin from 'firebase-admin';
import { getConfig } from './env.js';

let initialized = false;

/**
 * Initialize Firebase Admin SDK
 * 
 * For development without credentials, Firebase features will be mocked.
 */
export function initializeFirebase(): admin.app.App {
    if (initialized) {
        return admin.app();
    }

    const config = getConfig();

    try {
        // Check if service account path is provided
        if (config.firebaseServiceAccountPath) {
            // Load service account from file
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const serviceAccount = require(config.firebaseServiceAccountPath);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: config.firebaseProjectId,
            });

            console.log('🔥 Firebase Admin initialized with service account');
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Use Application Default Credentials
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: config.firebaseProjectId,
            });

            console.log('🔥 Firebase Admin initialized with ADC');
        } else {
            // Development mode - initialize without credentials
            console.log('⚠️ Firebase Admin not configured - using mock mode');
            console.log('   Set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS');

            // Return a minimal mock for development
            admin.initializeApp({
                projectId: config.firebaseProjectId || 'demo-project',
            });
        }

        initialized = true;
        return admin.app();
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        throw error;
    }
}

/**
 * Get Firestore instance
 */
export function getFirestore(): admin.firestore.Firestore {
    if (!initialized) {
        initializeFirebase();
    }
    return admin.firestore();
}

/**
 * Check if Firebase is properly configured
 */
export function isFirebaseConfigured(): boolean {
    const config = getConfig();
    return !!(config.firebaseServiceAccountPath || process.env.GOOGLE_APPLICATION_CREDENTIALS);
}
