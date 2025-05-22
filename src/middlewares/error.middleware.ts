import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/ApiError";
import { ApiResponse } from "../utils/apiResponse";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    return ApiResponse.error(res, "Error de validación", 400, errors);
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Handle Sequelize errors
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return ApiResponse.error(
      res,
      "Error de validación en la base de datos",
      400
    );
  }

  // Handle other errors
  return ApiResponse.error(res, "Error interno del servidor", 500);
};
