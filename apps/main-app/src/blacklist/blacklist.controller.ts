import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlacklistService } from './blacklist.service';

@Controller('blacklist')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Put()
  async update(@Req() req: any) {
    return this.blacklistService.update({
      data: {
        owner: {
          connect: {
            id: req.user.userId,
          },
        },
        list: req.body.list,
      },
      where: {
        ownerId: req.user.userId,
      },
    });
  }

  @Get()
  async findOne(@Req() req: any) {
    return this.blacklistService.findOne({
      where: {
        ownerId: req.user.userId,
      },
    });
  }
}
