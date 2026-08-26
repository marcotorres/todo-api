import { Request, Response, NextFunction } from "express";
import { jwtService, TokenPayload } from "../../../infrastructure";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Unauthorized: No token provided",
    });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid token",
    });
  }
};

export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
  } catch (error) {
    // Token invalid, but continue without user
  }

  next();
};
