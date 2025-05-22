import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token manquant ou mal formé" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await User.findById(decoded.id).select("username email");

    if (!user) {
      res.status(401).json({ message: "Utilisateur non trouvé" });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
