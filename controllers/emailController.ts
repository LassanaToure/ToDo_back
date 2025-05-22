import { Request, Response } from "express";
import User from "../models/User";
import { sendVerificationEmail } from "../services/mailService";

export const sendEmailVerificationCode = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email déjà vérifié" });
    }

    const emailCode = Math.floor(100000 + Math.random() * 900000);
    user.emailCode = emailCode;
    await user.save();

    await sendVerificationEmail(normalizedEmail, emailCode);
    return res.status(200).json({ message: "Code envoyé avec succès" });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: err.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email déjà vérifié" });
    }
    if (parseInt(code) !== user.emailCode) {
      return res.status(400).json({ message: "Code invalide" });
    }

    user.isEmailVerified = true;
    user.emailCode = null;
    await user.save();

    return res.status(200).json({
      message: "Email vérifié avec succès",
      user: { isEmailVerified: user.isEmailVerified },
    });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: err.message });
  }
};
