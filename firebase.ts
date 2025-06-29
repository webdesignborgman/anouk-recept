// lib/firebase.ts  (of root /firebase.ts — wat jij gebruikt)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";

// 1) Jouw .env vars – controleer dat alle waarden écht ingevuld zijn!
const firebaseConfig = {
  apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY!, 
  authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Log hem even in je console om te checken:
console.log("🔥 Firebase config:", firebaseConfig);

const app = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApp();

// Auth & Storage blijven ongewijzigd
export const auth    = getAuth(app);
export const storage = getStorage(app);

// 2) Gebruik initializeFirestore mét long-polling en zonder fetch-streams
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
