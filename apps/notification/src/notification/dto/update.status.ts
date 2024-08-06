import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  read: boolean;
}
