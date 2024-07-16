import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";



@Entity()
export class Product {
  @ApiProperty({
    example: 'cd6b4b7b-1b1b-4b3b-8b1b-1b1b4b3b8b1b',
    description: 'Identificador único del producto',
    uniqueItems: true,
    type: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Camiseta de algodón',
    description: 'Título del producto',
    uniqueItems: true,
    type: 'string',
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 100,
    description: 'Precio del producto',
    type: 'number',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'Camiseta de algodón de color blanco',
    description: 'Descripción del producto',
    type: 'string',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 'camiseta_de_algodon',
    description: 'Slug del producto',
    type: 'string',
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 100,
    description: 'Cantidad de productos en stock',
    type: 'number',
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Tallas disponibles del producto',
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @Column('text', { array: true })
  sizes: Array<string>;

  @ApiProperty({
    example: 'Hombre',
    description: 'Género del producto',
    type: 'string',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['Camisetas', 'Ropa'],
    description: 'Categorías del producto',
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @Column('text', { array: true, default: [] })
  tags: Array<string>;

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, { cascade: true, eager: true })
  images?: Array<ProductImage>;

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }
}
