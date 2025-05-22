import { Request, Response, NextFunction } from "express";
import Todo from "../models/Todo";

interface AuthRequest extends Request {
  user?: { _id: string };
}

export const checkTodoOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo non trouvé" });
    }

    if (todo.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Accès refusé : pas propriétaire" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
