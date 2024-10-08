import { ErrorType, Token } from '@app/common/types';
import { comparePassword } from '@app/common/utils';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { UserService } from '../user/user.service';
import { generatePassword } from '../utils/string';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Validate user
   * @param email
   * @param password
   * @returns a Token model
   */
  async validateUser(email: string, password: string): Promise<Token> {
    const user = await this.userService.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException({
        message: 'User not found',
        error: ErrorType.NOTFOUND,
      });
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    const payload = { sub: user.id, username: user.email };
    return this.createAuthResponse(user, payload);
  }

  /**
   * Create auth response
   * @param user
   * @param payload
   * @returns a Token model
   */
  async createAuthResponse(
    user: any,
    payload: { sub: string; username: string },
  ) {
    return {
      userId: user.id,
      token: await this.createToken(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET || '',
        process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
      ),
      type: 'Bearer',
      refreshToken: await this.createToken(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET || '',
        process.env.JWT_REFRESH_TOKEN_EXPIRE || '',
      ),
      issuedAt: new Date(),
      expireAt: new Date(
        Date.now() + ms(process.env.JWT_ACCESS_TOKEN_EXPIRE || ''),
      ),
    };
  }

  /**
   * Create token
   * @param payload
   * @param secretkey
   * @param expiresIn
   * @returns a string
   */
  async createToken(
    payload: any,
    secretkey: string,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { secret: secretkey, expiresIn });
  }

  /**
   * Validate refresh token
   * @param token
   * @returns a Token model
   */
  async validateRefreshToken(token: string): Promise<Token> {
    const { sub, username } = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    return {
      userId: sub,
      token: await this.createToken(
        { sub, username },
        process.env.JWT_ACCESS_TOKEN_SECRET || '',
        process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
      ),
      type: 'Bearer',
      refreshToken: await this.createToken(
        { sub, username },
        process.env.JWT_REFRESH_TOKEN_SECRET || '',
        process.env.JWT_REFRESH_TOKEN_EXPIRE || '',
      ),
      issuedAt: new Date(),
      expireAt: new Date(
        Date.now() + ms(process.env.JWT_ACCESS_TOKEN_EXPIRE || ''),
      ),
    };
  }

  async signin(data: { email: string; password: string }) {
    return this.validateUser(data.email, data.password);
  }

  async signup(data: { email: string; password: string }) {
    const user = await this.userService.create(data);
    if (user) return this.validateUser(data.email, data.password);
    return;
  }

  async refreshToken(data: { refreshToken: string }) {
    return this.validateRefreshToken(data.refreshToken);
  }

  /**
   * Generate token model or create a new user if not exist when user sign in with oauth
   * @param user user object from oauth
   * @returns a Token model
   */
  async oauthSignin(user: any) {
    const { email, firstName, lastName } = user;
    const userExist = await this.userService.findOne({ where: { email } });
    if (userExist) {
      return this.createAuthResponse(userExist, {
        sub: userExist.id,
        username: userExist.email,
      });
    } else {
      const newUser = await this.userService.create({
        email,
        password: generatePassword({ length: 10 }),
      });
      return this.createAuthResponse(newUser, {
        sub: newUser.id,
        username: newUser.email,
      });
    }
  }
}
