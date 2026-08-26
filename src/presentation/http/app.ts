import express, { Application } from "express";
import cors from "cors";
import { createTaskRoutes, createUserRoutes } from "./routes";
import { errorHandler } from "./middleware";
import { ITaskRepository, IUserRepository } from "../../domain";

export interface AppDependencies {
  taskRepository: ITaskRepository;
  userRepository: IUserRepository;
}

export const createApp = (dependencies: AppDependencies): Application => {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.use("/tasks", createTaskRoutes(dependencies.taskRepository));
  app.use("/users", createUserRoutes(dependencies.userRepository));

  app.get("/", (_req, res) => {
    res.json({
      message: "TODO API",
      version: "1.0.0",
      status: "healthy",
    });
  });

  app.use(errorHandler);

  return app;
};
