import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../utils/authenticated-socket';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private jwtService: JwtService) {}
  @WebSocketServer() server: Server;
  afterInit() {
    console.log('Gateway initialized');
  }

  handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new WsException('Unauthorized');
      }
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      client.user = {
        userId: payload.sub,
        email: payload.email,
      };
    } catch (err) {
      console.log(err);
      client.disconnect(); // Disconnect if token is invalid
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedSocket, @MessageBody() body: any): void {
    console.log(body);
    this.server.emit('message', body);
  }
}
