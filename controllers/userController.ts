import { Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Todo from "../models/Todo";
import { AuthRequest } from "../middleware/authMiddleware";
import { sendVerificationEmail } from "../services/mailService";

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const { username, email, password } = req.body;
    const updateData: any = {};

    if (username) {
      updateData.username = username;
    }

    if (email && email !== user.email) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailCode = Math.floor(100000 + Math.random() * 900000);

      user.email = normalizedEmail;
      user.emailCode = emailCode;
      user.isEmailVerified = false;
      await user.save();

      await sendVerificationEmail(normalizedEmail, emailCode);

      updateData.email = normalizedEmail;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password -emailCode");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({ message: "Utilisateur mis à jour", user: updatedUser });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Non autorisé" });

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await Todo.deleteMany({ owner: userId });

    return res.json({ message: "Compte utilisateur supprimé" });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
