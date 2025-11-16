"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUserProfile = void 0;
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
/**
 * Auth function stub - in Firebase v2, auth triggers are limited.
 * User profile creation is better handled:
 * 1. Via a callable function that clients invoke after signup
 * 2. Via custom claims set after auth creation
 * 3. Via a Firestore trigger when a user collection document is written
 *
 * For now, this is stubbed. You can trigger user profile creation from the client
 * after successful auth signup.
 */
const ensureUserProfile = async (userId, email, displayName) => {
    const db = (0, firestore_1.getFirestore)();
    const userRef = db.collection('users').doc(userId);
    firebase_functions_1.logger.info(`Creating user profile for: ${userId}`);
    try {
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({
                uid: userId,
                email: email || '',
                displayName: displayName || email?.split('@')[0] || 'Raider',
                username: displayName || email?.split('@')[0] || 'Raider',
                joinDate: new Date().toISOString(),
                photoURL: null,
            });
            firebase_functions_1.logger.info(`Successfully created user profile for: ${userId}`);
        }
    }
    catch (error) {
        firebase_functions_1.logger.error(`Error creating user profile for ${userId}:`, error);
    }
};
exports.ensureUserProfile = ensureUserProfile;
//# sourceMappingURL=auth.js.map