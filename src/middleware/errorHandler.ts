import { Request, Response, NextFunction } from "express";

export function serverErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(error.status || 500).json({
    error: error.message || "Error inesperado en el servidor",
    errors: error.errors || undefined
  });
}