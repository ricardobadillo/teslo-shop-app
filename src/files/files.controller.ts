import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { diskStorage } from 'multer';

import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';

import { FilesService } from './files.service';


@ApiTags('Archivos')
@Controller('files')
export class FilesController {
  constructor(private readonly configService: ConfigService, private readonly filesService: FilesService) { }

  @Get('product/:imageId')
  public findProductImage(
    @Res() res: Response,
    @Param('imageId') imageId: string
  ) {
    const path = this.filesService.getStaticProductImage(imageId);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fieldSize: 1000000 },
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer,
    })
  }))
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure that the file is a image');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }
}
