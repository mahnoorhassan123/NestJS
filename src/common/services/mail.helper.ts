import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface EmailTemplateOptions {
  to: string;
  subject: string;
  firstName: string;
  lastName: string;
  link: string;
}

@Injectable()
export class MailHelper {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER ?? 'user@example.com',
      pass: process.env.SMTP_PASS ?? 'yourpassword',
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: '"Intrepidcs" <no-reply@intrepidcs.com>',
      to,
      subject,
      html,
    });
  }

  async sendWelcomeEmail({ to, firstName, lastName, link, subject }: EmailTemplateOptions) {
    const html = `
      <b>Dear ${firstName} ${lastName},</b>
      <br><br>
      <p>Welcome to Intrepidcs! Please verify your account using the link below:</p>
      <a href="${link}">${link}</a>
      <br><br>
      <p>Thank you.</p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendResetPasswordEmail({ to, firstName, lastName, link, subject }: EmailTemplateOptions) {
    const html = `
      <b>Dear ${firstName} ${lastName},</b>
      <br><br>
      <p>You have requested a password reset. Please use the link below to set a new password:</p>
      <a href="${link}">${link}</a>
      <br><br>
      <p>Thank you.</p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendLockAccountEmail({ to, firstName, lastName, link, subject }: EmailTemplateOptions) {
    const html = `
      <b>Dear ${firstName} ${lastName},</b>
      <br><br>
      <p>Your account has been blocked due to multiple failed login attempts.</p>
      <p>You can reset your password using the link below or contact the administrator:</p>
      <a href="${link}">${link}</a>
      <br><br>
      <p>Thank you.</p>
    `;
    return this.sendMail(to, subject, html);
  }
}
