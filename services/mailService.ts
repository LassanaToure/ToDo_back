import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("EMAIL_USER ou EMAIL_PASS non définis");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (
  to: string,
  code: number
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Todo: Code de vérification email",
    html: `<p>Votre code de vérification est : <strong>${code}</strong></p>`,
  });
};
