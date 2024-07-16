import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/auth/entities/user.entity';

import { ProductService } from 'src/product/product.service';

import { initialData } from './data/seed-data';



@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private productService: ProductService
  ) { }

  public async execute() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);

    return 'Seed executed successfully!';
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUser = initialData.user;
    const users: Array<User> = [];

    seedUser.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUser = await this.userRepository.save(users);
    return dbUser[0];
  }

  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}