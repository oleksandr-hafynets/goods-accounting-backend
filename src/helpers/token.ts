import jwt from "jsonwebtoken";
import { DecodedToken } from "../types";

export const generateToken = (data: DecodedToken): string => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h",
  });
};
