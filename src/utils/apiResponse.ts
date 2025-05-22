import type { Response } from "express";

export class ApiResponse {
  static success(
    res: Response,
    data: any,
    message = "Operación exitosa",
    pagination?: any,
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static error(
    res: Response,
    message = "Error en la operación",
    statusCode = 500,
    errors?: any
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
