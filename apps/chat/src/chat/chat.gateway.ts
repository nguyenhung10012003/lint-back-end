import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
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
import { InboxService } from '../inbox/inbox.service';
import { MessageService } from '../message/message.service';
import { CreateMessageDto } from '../message/model/message.dto';
import { RoomService } from '../room/room.service';
import { SessionService } from '../session/session.service';
import { AuthenticatedSocket } from '../utils/authenticated-socket';
import { ReadMessageDto } from './dto/read-message.dto';
import { TypingDto } from './dto/typing.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly messageService: MessageService,
    private readonly inboxService: InboxService,
    private readonly roomService: RoomService,
  ) {}
  @WebSocketServer() server: Server;
  afterInit() {
    console.log('Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
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
      await this.sessionService.create({
        clientId: client.id,
        userId: payload.sub,
      });
    } catch (err) {
      console.log(err);
      client.disconnect(); // Disconnect if token is invalid
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    await this.sessionService.delete({
      clientId: client.id,
      userId: client.user.userId,
    });
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Handle event when a client sends a message to another user or group
   * @param client The client that sent the message
   * @param body The message content
   */
  @SubscribeMessage('send-message')
  async onSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: CreateMessageDto,
  ): Promise<void> {
    // Create a new message
    // If the roomId is not provided, create a new room with the current user as a member
    // If the roomId is provided, add the message to the existing room
    const message = await this.messageService.createMessage({
      data: !body.roomId
        ? {
            content: body.content,
            messageType: body.messageType,
            senderId: client.user.userId,
            readBy: [client.user.userId],
            room: {
              create: {
                members: [...(body.members || []), client.user.userId],
                createdBy: client.user.userId,
                subcription: {
                  createMany: {
                    data: body.members
                      ? body.members.map((userId) => ({
                          userId,
                          setting: {
                            push: true,
                            mute: false,
                          },
                        }))
                      : [],
                  },
                },
              },
            },
          }
        : {
            content: body.content,
            messageType: body.messageType,
            senderId: client.user.userId,
            roomId: body.roomId,
          },
    });

    // Get all clients in the room
    const clients = await this.sessionService.getMany({
      where: {
        userId: {
          in: message.room.members,
        },
      },
    });

    // Send the message to all clients in the room
    this.server
      .to(clients.map((c) => (c.clientId === client.id ? '' : c.clientId)))
      .emit('new-message', message);
  }

  /**
   * Handle event when a user reads a message
   * @param client The client that read the message
   * @param body The message to be marked as read
   */
  @SubscribeMessage('read-message')
  async onReadMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: ReadMessageDto,
  ) {
    await this.inboxService.updateLastMessageRead({
      userId: client.user.userId,
      roomId: body.roomId,
      lastMessageReadId: body.messageId,
    });
  }

  @SubscribeMessage('typing')
  async onTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: TypingDto,
  ) {
    // Get the room
    const room = await this.roomService.getRoom({
      where: {
        id: body.roomId,
      },
    });

    // Get all clients in the room
    const clients = await this.sessionService.getMany({
      where: {
        userId: {
          in: room.members,
        },
      },
    });

    this.server
      .to(clients.map((c) => (c.clientId === client.id ? '' : c.clientId)))
      .emit('typing', { userId: client.user.userId, roomId: body.roomId });
  }

  @SubscribeMessage('stop-typing')
  async onStopTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: TypingDto,
  ) {
    // Get the room
    const room = await this.roomService.getRoom({
      where: {
        id: body.roomId,
      },
    });

    // Get all clients in the room
    const clients = await this.sessionService.getMany({
      where: {
        userId: {
          in: room.members,
        },
      },
    });

    this.server
      .to(clients.map((c) => (c.clientId === client.id ? '' : c.clientId)))
      .emit('stop-typing', { userId: client.user.userId, roomId: body.roomId });
  }
}
