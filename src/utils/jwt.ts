import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error("Token inválido");
  }
};
