import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../application/errors";

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  console.error("Unexpected error:", err);
  const response: ApiResponse = {
    success: false,
    error: "Internal server error",
  };
  res.status(500).json(response);
};
