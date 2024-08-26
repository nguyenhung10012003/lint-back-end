import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingDto } from './model/setting.dto';
import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';

@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Put()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ErrorInterceptor)
  async upsertSetting(@Request() request, @Body() data: SettingDto) {
    return this.settingService.upsertSetting(request.user.userId, data);
  }
}
