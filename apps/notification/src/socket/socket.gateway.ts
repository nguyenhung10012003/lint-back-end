import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt.payload';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from '../notification/dto/notification';

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  async afterInit() {
    console.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      client.disconnect(true);
      console.log('Unauthorized');
      return;
    }

    const token = authHeader.split(' ')[1];
    let payload: JwtPayload;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET || '',
      ) as JwtPayload;
    } catch (error) {
      client.disconnect(true);
      console.log('Unauthorize: Invalid token');
      return;
    }

    client.data.userId = payload.sub;
    client.join(`user_${payload.sub}`);
    console.log(`Client ${client.id} connected`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @OnEvent('notification')
  handleCreatedEvent(notification: Notification) {
    console.log('notification', notification);
    this.server.to(`user_${notification.userId}`).emit('notification', {
      message: 'notification',
      data: notification,
    });
  }
}
