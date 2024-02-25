import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDTO {

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}