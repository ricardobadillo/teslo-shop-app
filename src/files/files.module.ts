import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FilesController } from './files.controller';

import { FilesService } from './files.service';



@Module({
  controllers: [FilesController],
  imports: [ConfigModule],
  providers: [FilesService],
})
export class FilesModule { }
