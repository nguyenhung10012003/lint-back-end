export class Token {
  userId: string;
  token: string;
  type: string;
  refreshToken: string;
  issuedAt: Date;
  expireAt: Date;
}
