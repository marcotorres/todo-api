import * as functions from "firebase-functions";
import { createApp } from "./presentation/http";
import {
  FirestoreTaskRepository,
  FirestoreUserRepository,
} from "./infrastructure";

const taskRepository = new FirestoreTaskRepository();
const userRepository = new FirestoreUserRepository();

const app = createApp({ taskRepository, userRepository });

export const api = functions.https.onRequest(app);
