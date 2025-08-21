import { MailHelper } from './mail.helper';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailHelper', () => {
  let mailHelper: MailHelper;
  let sendMailMock: jest.Mock;

  beforeEach(() => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: '12345' });

    // Mock createTransport to return an object with sendMail function
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    mailHelper = new MailHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMail', () => {
    it('should call transporter.sendMail with correct params', async () => {
      const to = 'test@example.com';
      const subject = 'Subject';
      const html = '<p>Hello</p>';

      await mailHelper.sendMail(to, subject, html);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Intrepidcs" <no-reply@intrepidcs.com>',
        to,
        subject,
        html,
      });
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct html content', async () => {
      const options = {
        to: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        link: 'https://verify-link',
        subject: 'Welcome!',
      };

      await mailHelper.sendWelcomeEmail(options);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Intrepidcs" <no-reply@intrepidcs.com>',
        to: options.to,
        subject: options.subject,
        html: expect.stringContaining(`Dear ${options.firstName} ${options.lastName}`),
      });
      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(`<a href="${options.link}">${options.link}</a>`),
        }),
      );
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('should send reset password email with correct html content', async () => {
      const options = {
        to: 'user@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        link: 'https://reset-link',
        subject: 'Reset Password',
      };

      await mailHelper.sendResetPasswordEmail(options);

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: options.to,
          subject: options.subject,
          html: expect.stringContaining('You have requested a password reset'),
        }),
      );
      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(`<a href="${options.link}">${options.link}</a>`),
        }),
      );
    });
  });

  describe('sendLockAccountEmail', () => {
    it('should send lock account email with correct html content', async () => {
      const options = {
        to: 'user@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        link: 'https://unlock-link',
        subject: 'Account Locked',
      };

      await mailHelper.sendLockAccountEmail(options);

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: options.to,
          subject: options.subject,
          html: expect.stringContaining('Your account has been blocked due to multiple failed login attempts'),
        }),
      );
      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(`<a href="${options.link}">${options.link}</a>`),
        }),
      );
    });
  });
});
