import { Request, Response } from "express";
import TodoModel from "../models/Todo";
import { AuthRequest } from "../middleware/authMiddleware";

interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}
export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const todos = await TodoModel.find({ owner: req.user?._id });
    res.json(todos);
  } catch (err: any) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const newTodo = new TodoModel({
      title,
      description,
      owner: req.user?._id,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err: any) {
    console.error("Erreur création todo :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updateData: TodoUpdate = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await TodoModel.findOneAndUpdate(
      { _id: id, owner: req.user?._id },
      updateData,
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo non trouvé" });
    }

    res.json(todo);
  } catch (err: any) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await TodoModel.findOneAndDelete({
      _id: id,
      owner: req.user?._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo non trouvé" });
    }

    res.json({ message: "Todo supprimé" });
  } catch (err: any) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
