import nodemailer from 'nodemailer';

export class MailHelper {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER || 'your_email@example.com',
      pass: process.env.SMTP_PASS || 'your_password',
    },
  });

  static async errorReport(mailObj: {
    subject?: string;
    error: string;
    attachments?: any[];
  }) {
    const mailOptions = {
      from: '"Intrepidcs" <icscontactus@intrepidcs.com>',
      to: process.env.REPORT_TO || 'awaisayub149@gmail.com',
      subject: mailObj.subject || 'Some Error Occurred In Blue Sky',
      html: `<b>Status:</b><p>${mailObj.error}</p>` || '<p>Unknown error occurred on bluesky</p>',
      attachments: mailObj.attachments || [],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Error report sent successfully');
    } catch (err: any) {
      console.error('Failed to send error report:', err.message);
    }
  }
}
