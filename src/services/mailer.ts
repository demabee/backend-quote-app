import nodemailer, { TransportOptions } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Define the transport options with type assertion as SMTPTransport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "0"), // Ensure PORT is a number
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}) as nodemailer.Transporter<TransportOptions>;

export const sendEmail = async (
  recipient: string,
  subject: string,
  body: string,
  isHTML?: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: body,
      ...(isHTML && { html: body }),
    });
    return { success: true, message: "Email sent!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};

export default sendEmail;
