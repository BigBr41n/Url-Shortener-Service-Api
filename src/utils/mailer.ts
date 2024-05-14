import nodemailer, { Transporter } from "nodemailer";
import logger from "./logger";

interface EmailTemplateProps {
  activationToken: string;
  username: string;
}

export const sendActivationEmail = async (
  email: string,
  username: string,
  activationToken: string
) => {
  // Replace with your email service configuration
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // Adjust based on your SMTP server configuration
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailTemplate = ({ activationToken, username }: EmailTemplateProps) => {
    // Create a well-formatted email template with activation link
    return `
      <h1>Welcome to Your App, ${username}!</h1>
      <p>Click the link below to activate your account:</p>
      <a href="http://${process.env.DOMAIN}/activate?token=${activationToken}">Activate Account</a>
    `;
  };

  const mailOptions = {
    from: process.env.EMAIL, // Replace with your sender email
    to: email,
    subject: "Activate Your Account",
    html: emailTemplate({ activationToken, username }),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Activation email sent to ${email}`);
  } catch (err) {
    logger.error("Error sending activation email:", err);
  }
};

export default sendActivationEmail;
