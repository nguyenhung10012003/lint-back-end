import { IsNumber, IsOptional } from 'class-validator';

export class NotificationWhereUniqueDto {
  @IsNumber()
  id: string;

  @IsNumber()
  @IsOptional()
  userId?: string;
}
