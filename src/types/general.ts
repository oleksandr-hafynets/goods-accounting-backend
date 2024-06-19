import { Request } from "express";

export type TRole = "ADMIN" | "USER";

export interface DecodedToken {
  id: number;
  role: TRole;
}

export interface ExtendedRequest extends Request {
  userKey?: DecodedToken;
}
