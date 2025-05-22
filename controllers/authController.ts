import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { createToken } from "../services/tokenService";
import { sendVerificationEmail } from "../services/mailService";
import { verifyToken } from "../services/tokenService";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const emailCode = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      emailCode,
      isEmailVerified: false,
      todos: [],
    });
    await newUser.save();

    await sendVerificationEmail(normalizedEmail, emailCode);

    const token = createToken({ _id: newUser._id, username: newUser.username });

    const { password: _pw, emailCode: _code, ...userSafe } = newUser.toObject();

    return res.status(201).json({
      message: "Utilisateur créé avec succès. Vérifiez votre email.",
      user: userSafe,
      token,
    });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide" });
    }

    const token = createToken({ _id: user._id, username: user.username });

    const { password: _pw, emailCode: _code, ...userSafe } = user.toObject();

    return res.json({ token, user: userSafe });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select("-password -emailCode");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json({ message: "Token valide", user });
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
