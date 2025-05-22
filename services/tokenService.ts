import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET non défini");

export interface JwtPayload {
  id: string;
  username?: string;
}

export const createToken = (user: {
  _id: Types.ObjectId | string;
  username?: string;
}): string => {
  return jwt.sign(
    { id: user._id.toString(), username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
