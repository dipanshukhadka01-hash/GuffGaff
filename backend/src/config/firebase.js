import admin from 'firebase-admin';

let firebaseInitialized = false;

export const initFirebaseAdmin = () => {
  if (firebaseInitialized) return admin;

  if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn('⚠️ Firebase admin not initialised: missing FIREBASE_PROJECT_ID.');
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });

  firebaseInitialized = true;
  console.log('✅ Firebase admin initialised');
  return admin;
};

export const verifyFirebaseToken = async (idToken) => {
  const firebase = initFirebaseAdmin();
  if (!firebase) return null;

  try {
    return await firebase.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error('Failed to verify Firebase token', error);
    return null;
  }
};
