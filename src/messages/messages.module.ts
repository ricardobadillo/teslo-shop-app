import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

import { AuthModule } from '../auth/auth.module';



@Module({
  providers: [JwtService, MessagesGateway, MessagesService],
  imports: [AuthModule]
})
export class MessagesModule { }