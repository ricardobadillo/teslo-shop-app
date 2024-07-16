import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { validate } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/user.entity';



@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage) private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) { }

  public async create(createProductDto: CreateProductDto, user: User) {

    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) => this.productImageRepository.create({ url: image })),
        user: user
      });

      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  public async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;

    const products = await this.productRepository.find({ skip: offset, take: limit, relations: { images: true } });

    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url)
    }));
  }

  public async findOne(term: string): Promise<Product> {

    let product: Product;

    if (validate(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where(`UPPER(title) = :title or slug = :slug`, { title: term.toUpperCase(), slug: term.toLowerCase() })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }

    if (!product) throw new NotFoundException('El producto no fue encontrado');

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);

    return { ...product, images: images.map((image) => image.url) };
  }

  public async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });

    if (!product) throw new NotFoundException(`No se encontró el producto con el id ${id}`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) => this.productImageRepository.create({ url: image }));
      }

      product.user = user;

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  public async remove(id: string) {
    const { affected } = await this.productRepository.delete({ id });

    if (affected === 0) throw new NotFoundException(`No se encontró el producto con el id ${id}`);
    return id;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(`Error creating product: ${error.message}`);
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}