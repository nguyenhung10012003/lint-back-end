import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-chat-client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  async createRoom(params: Prisma.RoomCreateArgs) {
    return this.prisma.room.create(params);
  }

  async getRooms(params: Prisma.RoomFindManyArgs) {
    return this.prisma.client.room.findMany(params);
  }

  async getRoom(params: Prisma.RoomFindUniqueArgs) {
    return this.prisma.room.findUnique(params);
  }

  async updateRoom(params: Prisma.RoomUpdateArgs) {
    return this.prisma.room.update(params);
  }

  async deleteRoom(params: Prisma.RoomDeleteArgs) {
    return this.prisma.room.delete(params);
  }
}
