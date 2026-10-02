import { IsEnum, IsString } from 'class-validator';
import type { ConsentAction } from '@natanga/core';

/** DTO d'une action de consentement (grant / deny / revoke). */
export class ConsentActionDto {
  @IsEnum(['grant', 'deny', 'revoke'] satisfies ConsentAction[])
  @IsString()
  action!: ConsentAction;
}
