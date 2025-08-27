import { Test, TestingModule } from '@nestjs/testing';
import { SlackService } from '../services/slack.service';
import { WebClient } from '@slack/web-api';
import { faker } from '@faker-js/faker';

jest.mock('@slack/web-api'); 

describe('SlackService', () => {
  let service: SlackService;
  let mockPostMessage: jest.Mock;

  beforeEach(async () => {
    mockPostMessage = jest.fn().mockResolvedValue({});
     (WebClient as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        postMessage: mockPostMessage,
      },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackService],
    }).compile();

    service = module.get<SlackService>(SlackService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a slack message if SLACK_ALERTS is true', async () => {
    process.env.SLACK_ALERTS = 'true';
    const message = faker.lorem.sentence();
    const from = faker.internet.userName();
    const to = 'C1234567890';

    await service.send(message, from, to);

    expect(mockPostMessage).toHaveBeenCalledWith({
      channel: to,
      username: from,
      text: expect.stringContaining(message),
    });
  });

  it('should use default username and fallback channel if from/to not provided', async () => {
    process.env.SLACK_ALERTS = 'true';
    process.env.SEND_TO = 'C9999999999';
    const message = faker.lorem.sentence();

    await service.send(message);

    expect(mockPostMessage).toHaveBeenCalledWith({
      channel: 'C9999999999',
      username: 'blue-sky',
      text: expect.stringContaining(message),
    });
  });

  it('should log error if SLACK_ALERTS is false and to is C029PF7DLKE', async () => {
    process.env.SLACK_ALERTS = 'false';
    const message = faker.lorem.sentence();
    const spyLoggerError = jest.spyOn((service as any).logger, 'error');

    await service.send(message, undefined, 'C029PF7DLKE');

    expect(spyLoggerError).toHaveBeenCalledWith(
      expect.stringContaining(message),
    );
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('should catch errors and log them', async () => {
    process.env.SLACK_ALERTS = 'true';
    const message = faker.lorem.sentence();
    mockPostMessage.mockRejectedValueOnce(new Error('Slack API failed'));
    const spyLoggerError = jest.spyOn((service as any).logger, 'error');

    await service.send(message);

    expect(spyLoggerError).toHaveBeenCalledWith(
      'Error in Slack alert function:',
      expect.any(String),
      expect.any(String),
    );
  });
});
