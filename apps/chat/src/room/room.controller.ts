import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomQuery } from './model/room.query';
import { RoomService } from './room.service';

@Controller('room')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  /**
   * Get rooms for the current user with optional pagination and last message
   * If withLastMessage is true, the query will include the last message in the room
   * @param req request object
   * @param query skip, take, and withLastMessage query parameters
   * @returns list of rooms
   */
  @Get()
  async getRooms(@Req() req: any, @Query() query: RoomQuery) {
    return this.roomService.getRooms({
      skip: query.skip,
      take: query.take,
      where: {
        members: {
          has: req.user.userId,
        },
      },
      include: query.withLastMessage
        ? {
            lastMessage: true,
          }
        : undefined,
      orderBy: {
        lastMessage: {
          createdAt: 'desc',
        },
      },
    });
  }

  /**
   * Get a room by id
   * @param req request object
   * @param id room id
   * @returns room
   */
  @Get(':id')
  async getRoom(@Req() req: any, @Param('id') id: string) {
    return this.roomService.getRoom({
      where: {
        id: id,
        members: {
          has: req.user.userId,
        },
      },
    });
  }

  @Delete(':id')
  async deleteRoom(@Req() req: any, @Param('id') id: string) {
    return this.roomService.deleteRoom({
      where: {
        id: id,
        members: {
          has: req.user.userId,
        },
      },
    });
  }
}
