import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({
    example: 'Alimentação',
    description: 'Nome da categoria',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;
}
