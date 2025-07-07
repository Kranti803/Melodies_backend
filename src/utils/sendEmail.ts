import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER!,
      to,
      subject,
      text,
      html,
    });
  } catch (error: any) {
    console.log("Error sending email:", error);
  }
};

export default sendEmail;
