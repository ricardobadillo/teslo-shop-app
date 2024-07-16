import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';

import { ProductModule } from 'src/product/product.module';

import { AuthModule } from '../auth/auth.module';
import { SeedService } from './seed.service';
import { PassportModule } from '@nestjs/passport';



@Module({
  controllers: [SeedController],
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' }), ProductModule],
  providers: [SeedService],
})
export class SeedModule { }
