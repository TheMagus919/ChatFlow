import { JwtPayload } from "jsonwebtoken";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

export {};