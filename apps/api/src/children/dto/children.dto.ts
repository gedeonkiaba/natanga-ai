import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** DTO de création d'un profil enfant (US-02 / UC §4.3). */
export class CreateChildDto {
  @IsString()
  displayName!: string;

  @Type(() => Number)
  @IsInt({ message: 'année de naissance invalide' })
  @Min(1990, { message: 'année de naissance invalide' })
  @Max(2030, { message: 'année de naissance invalide' })
  birthYear!: number;

  @IsOptional()
  @IsString()
  avatar?: string;
}
