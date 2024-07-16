import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { NewMessageDto } from './dto/new-message.dto';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { MessagesService } from './messages.service';



@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messagesService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    this.wss.emit('message-from-server', {
      fullName: this.messagesService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });
  }
}