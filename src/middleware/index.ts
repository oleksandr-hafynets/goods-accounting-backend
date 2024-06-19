import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken, ExtendedRequest } from "../types";

export const verifyToken = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ isAuth: false, message: "Access token is missing" });
  } else {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as DecodedToken;
      req.userKey = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      res.status(401).json({ isAuth: false, message: "Invalid access token" });
    }
  }
};

export const checkAdmin = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.userKey?.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden: Admins only" });
  } else {
    next();
  }
};
