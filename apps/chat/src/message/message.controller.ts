import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto, UpdateMessageDto } from './model/message.dto';
import { MessageQuery } from './model/message.query';

@Controller('/message')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * Create a new message by providing the content, messageType, and roomId
   * @param req a request object
   * @param body a CreateMessageDto object:
   * - content: the content of the message
   * - messageType: the type of the message
   * - roomId: the room id to add the message to (optional, only used when adding a message to an existing room)
   * - members: an array of user ids to add to the room (optional, only used when creating a new room)
   * @returns a new message object
   */
  @Post()
  async createMessage(@Req() req: any, @Body() body: CreateMessageDto) {
    // If the roomId is not provided, create a new room with the current user as a member
    // For this scenario to occur the first time a user sends a message to another user or group of users
    if (!body.roomId) {
      return this.messageService.createMessage({
        data: {
          content: body.content,
          messageType: body.messageType,
          senderId: req.user.userId,
          readBy: [req.user.userId],
          room: {
            create: {
              members: [...(body.members || []), req.user.userId],
              createdBy: req.user.userId,
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
        },
      });
    }

    // If the roomId is provided, add the message to the existing room
    return this.messageService.createMessage({
      data: {
        content: body.content,
        messageType: body.messageType,
        senderId: req.user.userId,
        roomId: body.roomId,
      },
    });
  }

  /**
   * Get all messages of all rooms that the current user is a member of with optional query parameters
   * @param req a request object
   * @param query a MessageQuery object:
   * - skip: number of messages to skip
   * - take: number of messages to take
   * - roomId: the room id to filter messages by room
   * - include: an array of strings to include in the query. Each string can be 'room', 'replies', or 'replyTo'
   * - orderField: the field to order by. Default is 'createdAt'
   * - orderDirection: the direction to order by. Default is 'desc'
   * @returns an array of message objects
   */
  @Get()
  async getMessages(@Req() req: any, @Query() query: MessageQuery) {
    return this.messageService.getMessages({
      skip: query.skip,
      take: query.take,
      where: {
        roomId: query.roomId,
        room: {
          members: {
            has: req.user.userId,
          },
        },
        createdAt: {
          lt: new Date(query.lastTimestamp || Date.now()),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: query.extractInclude(),
    });
  }

  /**
   * Edit a message by providing the message id and the new content
   * @param req a request object
   * @param id the message id
   * @returns a message object
   */
  @Patch(':id')
  async updateMessage(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateMessageDto,
  ) {
    return this.messageService.updateMessage({
      where: {
        id: id,
        senderId: req.user.userId,
      },
      data: body,
    });
  }

  /**
   * Delete a message by providing the message id (soft delete)
   * @param req a request object
   * @param id the message id
   * @returns a message object
   */
  @Patch(':id/delete')
  async deleteMessage(@Req() req: any, @Param('id') id: string) {
    return this.messageService.softDeleteMessage({
      where: {
        id: id,
        senderId: req.user.userId,
      },
    });
  }
}
