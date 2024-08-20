import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UserQuery } from './model/user.query';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(
    @Query()
    query: UserQuery,
  ) {
    return this.userService.findAll(query.extract());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({
      where: { id },
      include: { profile: true },
    });
  }

  @Post()
  create(@Body() data: { email: string; password: string }) {
    return this.userService.create(data);
  }

  @Patch()
  update(@Req() req: any, @Body() data: { isPrivate: boolean }) {
    return this.userService.update({
      where: {
        id: req.user.userId,
      },
      data,
    });
  }
}
