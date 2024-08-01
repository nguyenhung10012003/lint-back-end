import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './app.controller';
import { NotificationService } from './app.service';

describe('NotificationController', () => {
  let notificationController: NotificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [NotificationService],
    }).compile();

    notificationController = app.get<NotificationController>(
      NotificationController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationController.getHello()).toBe('Hello World!');
    });
  });
});
