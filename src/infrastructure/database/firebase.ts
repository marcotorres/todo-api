import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();

export const COLLECTIONS = {
  TASKS: "tasks",
  USERS: "users",
} as const;
