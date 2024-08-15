import { Socket } from "socket.io";

export class AuthenticatedSocket extends Socket {
  user: any;
}