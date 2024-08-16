import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-chat-client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new session in the database
   * @param createSessionDto
   * clientID: string - the ID of the client socket
   * userID: string - the ID of the user
   * @returns a new session
   */
  async create(createSessionDto: CreateSessionDto) {
    const [session, active] = await Promise.all([
      this.prisma.session.create({ data: createSessionDto }),
      this.prisma.active.upsert({
        where: {
          userId: createSessionDto.userId,
        },
        create: {
          userId: createSessionDto.userId,
        },
        update: {
          isActive: true,
          lastActive: undefined,
        },
      }),
    ]);
    return session;
  }

  getOne() {}

  getMany(params: Prisma.SessionFindManyArgs) {
    return this.prisma.session.findMany(params);
  }

  /**
   * Delete a session from the database when a client disconnects
   * @param args expects a where clause to find the session. args include at least one of the following:
   * id: string - the ID of the session
   * clientId: string - the ID of the client socket
   */
  async delete(args: { clientId: string; userId: string }) {
    const [session, active] = await Promise.all([
      this.prisma.session.delete({
        where: {
          clientId: args.clientId,
        },
      }),
      this.prisma.active.update({
        where: {
          userId: args.userId,
        },
        data: {
          isActive: false,
          lastActive: new Date(),
        },
      }),
    ]);
    return session;
  }
}
