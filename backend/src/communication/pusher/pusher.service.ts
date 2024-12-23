import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: '1902741',
      key: '56d0ad2a5a08355cfb9d',
      secret: '3b6cd892e602bde12336',
      cluster: 'eu',
      useTLS: true,
    });
  }


  async trigger(channel: string, event: string, data: any): Promise<void> {
    await this.pusher.trigger(channel, event, data);
  }

  
  async sendNotification(channel: string, title: string, message: string): Promise<void> {
    const notificationData = {
      title,
      message,
      timestamp: new Date().toISOString(),
    };

    await this.pusher.trigger(channel, 'notification', notificationData);
  }
}
