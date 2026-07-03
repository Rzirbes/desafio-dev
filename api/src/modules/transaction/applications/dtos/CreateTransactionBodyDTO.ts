import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../../domain/enums/TransactionType';

export class CreateTransactionBodyDTO {
  @ApiProperty({ example: 'Compra no mercado' })
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 150.75 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({ example: '2026-07-03' })
  @IsOptional()
  @IsDateString()
  date?: string;
}
