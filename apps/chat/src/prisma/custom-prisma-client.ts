import { Prisma, PrismaClient } from '@prisma/prisma-chat-client';

export const customPrismaClient = (prismaClient: PrismaClient) => {
  return prismaClient
    .$extends({
      client: {
        async createMessage(params: Prisma.MessageCreateArgs) {
          const context: PrismaClient = await Prisma.getExtensionContext(this);
          const msg = await context.message.create(params);
          const room = await context.room.update({
            where: { id: msg.roomId },
            data: {
              lastMessage: {
                connect: {
                  id: msg.id,
                },
              },
            },
          });
          return { ...msg, room };
        },
      },
    })
    .$extends({
      result: {
        subcription: {
          unread: {
            needs: {
              lastMessageReadId: true,
              room: true as never,
            },
            compute(data: any) {
              if (data.lastMessageReadId === data.room.lastMessageId) {
                return false;
              } else return true;
            },
          },
        },
      },
    });
};

export class PrismaClientExtended extends PrismaClient {
  customPrismaClient: CustomPrismaClient;

  get client() {
    if (!this.customPrismaClient)
      this.customPrismaClient = customPrismaClient(this);

    return this.customPrismaClient;
  }
}

// Custom Prisma Client Type
export type CustomPrismaClient = ReturnType<typeof customPrismaClient>;
