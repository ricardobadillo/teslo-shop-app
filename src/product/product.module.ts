import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

import { ProductController } from './product.controller';

import { ProductService } from './product.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';



@Module({
  controllers: [ProductController],
  exports: [ProductService, TypeOrmModule],
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' }), TypeOrmModule.forFeature([Product, ProductImage])],
  providers: [ProductService],
})
export class ProductModule { }