import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';



export class PaginationDto {
  @ApiProperty({ default: 10, description: 'Cantidad de elementos a mostrar por página' })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ default: 0, description: 'Cantidad de elementos a omitir' })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}