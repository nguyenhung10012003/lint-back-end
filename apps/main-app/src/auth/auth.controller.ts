import { RefreshTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(ErrorInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() data: { email: string; password: string }) {
    return this.authService.signin(data);
  }

  @Post('signup')
  signup(@Body() data: { email: string; password: string }) {
    return this.authService.signup(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  refreshToken(@Body() data: { refreshToken: string }) {
    return this.authService.refreshToken(data);
  }
}
