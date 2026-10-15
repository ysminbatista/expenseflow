import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  description!: string;

  // RN01/RN10: sempre positivo; Decimal(10,2) comporta ate 99.999.999,99
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(99999999.99)
  amount!: number;

  @IsDateString()
  date!: string;

  @IsInt()
  categoryId!: number;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(99999999.99)
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class ListTransactionsQuery {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
