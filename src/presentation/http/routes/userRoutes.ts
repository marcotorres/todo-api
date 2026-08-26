import { Router } from "express";
import { UserController } from "../controllers";
import { asyncHandler, authMiddleware } from "../middleware";
import { IUserRepository } from "../../../domain";

export const createUserRoutes = (userRepository: IUserRepository): Router => {
  const router = Router();
  const controller = new UserController(userRepository);

  router.get("/:email", asyncHandler(controller.getByEmail)); // Public: search user by email
  router.post("/", asyncHandler(controller.create)); // Public: allow user registration
  router.post("/login", asyncHandler(controller.login)); // Public: login and get JWT token
  router.post("/refresh", asyncHandler(controller.refresh)); // Public: refresh access token
  router.patch("/", authMiddleware, asyncHandler(controller.update)); // Protected: update user profile

  return router;
};
