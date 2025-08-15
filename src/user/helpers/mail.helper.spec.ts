import { MailHelper } from './mail.helper';
import * as nodemailer from 'nodemailer';
import { faker } from '@faker-js/faker';
import { createMailOptionsFactory } from '../../utils/factories/mail.factory';

jest.mock('nodemailer');

describe('MailHelper', () => {
  let mailHelper: MailHelper;
  let sendMailMock: jest.Mock;

  beforeEach(() => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: faker.string.uuid() });

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
      const to = faker.internet.email();
      const subject = faker.lorem.words(3);
      const html = `<p>${faker.lorem.sentence()}</p>`;

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
      const options = createMailOptionsFactory({
        subject: 'Welcome!',
      });

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
      const options = createMailOptionsFactory({
        subject: 'Reset Password',
      });

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
      const options = createMailOptionsFactory({
        subject: 'Account Locked',
      });

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
