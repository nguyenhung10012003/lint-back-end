import { IsOptional } from 'class-validator';
import { $Enums } from '@prisma/prisma-main-client';
import { Type } from 'class-transformer';

export class SettingDto {
  @Type(() => String)
  @IsOptional()
  theme?: $Enums.Theme;

  @Type(() => String)
  @IsOptional()
  lang?: $Enums.Lang;

  @Type(() => String)
  @IsOptional()
  status: $Enums.AccountStatus;
}
