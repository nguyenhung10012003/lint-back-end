import { Prisma, PrismaClient } from '@prisma/prisma-chat-client';

export const customPrismaClient = (prismaClient: PrismaClient) => {
  return prismaClient.$extends({
    client: {
      async createMessage(params: Prisma.MessageCreateArgs) {
        const context = await Prisma.getExtensionContext(this);
        const msg = await context.message.create(params);
        await context.room.update({
          where: { id: msg.roomId },
          data: { lastActive: msg.createdAt },
        });
        return msg;
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
