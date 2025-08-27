import { Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  private readonly web: WebClient;
  private readonly logger = new Logger(SlackService.name);

  constructor() {
    this.web = new WebClient(process.env.SLACK_TOKEN);
  }

  async send(message: string, from?: string, to?: string): Promise<void> {
    try {
      const userId = to || process.env.SEND_TO || 'C01PX9SCTC0'; 
      const envMode = process.env.ENV_MODE || 'development';

      if (process.env.SLACK_ALERTS === 'true') {
        await this.web.chat.postMessage({
          channel: userId,
          username: from || 'blue-sky',
          text: `Env: ${envMode}\n${message || 'Something went wrong.'}`,
        });
        this.logger.log(`Message Posted: ${message || 'Something went wrong.'}`);
      } else {
        if (to === 'C029PF7DLKE') {
          this.logger.error(
            `Env: ${envMode}\n${message || 'Something went wrong.'}`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in Slack alert function:', error.message, error.stack);
    }
  }
}