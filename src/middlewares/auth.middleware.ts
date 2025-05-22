import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { ApiError } from "../errors/ApiError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false }, (err: Error, user: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new ApiError("No autorizado", 401));
    }
    // Add user to request object
    (req as any).user = user;

    return next();
  })(req, res, next);
};
