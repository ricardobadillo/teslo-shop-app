import { BadRequestException, Injectable } from '@nestjs/common';

import { existsSync } from 'fs';
import { join } from 'path';



@Injectable()
export class FilesService {

  public getStaticProductImage(imageId: string) {
    const path = join(__dirname, '../../static/uploads', imageId);

    if (!existsSync(path)) throw new BadRequestException('Image not found');
    return path;
  }
}
