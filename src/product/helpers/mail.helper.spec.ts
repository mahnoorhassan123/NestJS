import { MailHelper } from './mail.helper';
import nodemailer from 'nodemailer';

const sendMailMock = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: sendMailMock,
  })),
}));

describe('MailHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an error report successfully', async () => {
    // Arrange
    sendMailMock.mockResolvedValueOnce({ messageId: '123' });

    const mailObj = {
      subject: 'Test Subject',
      error: 'Something went wrong',
    };

    // Act
    await MailHelper.errorReport(mailObj);

    // Assert
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'your_email@example.com',
        pass: process.env.SMTP_PASS || 'your_password',
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: '"Intrepidcs" <icscontactus@intrepidcs.com>',
      to: process.env.REPORT_TO || 'awaisayub149@gmail.com',
      subject: 'Test Subject',
      html: '<b>Status:</b><p>Something went wrong</p>',
      attachments: [],
    });
  });

  it('should use default subject when subject is not provided', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: '456' });

    const mailObj = {
      error: 'Default subject test',
    };

    await MailHelper.errorReport(mailObj);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Some Error Occurred In Blue Sky',
      }),
    );
  });

  it('should log an error when sendMail fails', async () => {
    // Arrange
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    sendMailMock.mockRejectedValueOnce(new Error('SMTP Error'));

    const mailObj = {
      error: 'Failure case',
    };

    // Act
    await MailHelper.errorReport(mailObj);

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to send error report:',
      'SMTP Error',
    );

    consoleErrorSpy.mockRestore();
  });
});
