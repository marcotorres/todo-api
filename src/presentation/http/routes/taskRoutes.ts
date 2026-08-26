import { Router } from "express";
import { TaskController } from "../controllers";
import { asyncHandler, authMiddleware } from "../middleware";
import { ITaskRepository } from "../../../domain";

export const createTaskRoutes = (taskRepository: ITaskRepository): Router => {
  const router = Router();
  const controller = new TaskController(taskRepository);

  router.get("/", authMiddleware, asyncHandler(controller.getAll));
  router.post("/", authMiddleware, asyncHandler(controller.create));
  router.put("/:id", authMiddleware, asyncHandler(controller.update));
  router.patch("/:id", authMiddleware, asyncHandler(controller.patch));
  router.delete("/:id", authMiddleware, asyncHandler(controller.delete));

  return router;
};
