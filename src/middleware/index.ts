import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken, ExtendedRequest } from "../types";

export const verifyToken = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ isAuth: false, message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as DecodedToken;
    req.userKey = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ isAuth: false, message: "Invalid access token" });
  }
};

export const checkAdmin = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userKey?.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
