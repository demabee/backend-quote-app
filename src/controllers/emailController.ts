import { Request, Response } from "express";
import sendEmail from "../services/mailer";

export const sendEmailController = async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail(to, subject, text);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Failed to send email");
  }
};
