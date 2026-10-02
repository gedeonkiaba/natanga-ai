import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import type { Role } from '@natanga/core';

/** DTO de création de compte parent (US-01 / UC-C1). */
export class RegisterDto {
  @IsEmail({}, { message: 'email invalide' })
  email!: string;

  @IsString()
  @Length(8, 128, { message: 'le mot de passe doit contenir 8 à 128 caractères' })
  password!: string;

  @IsOptional()
  @IsEnum(['parent'] satisfies Role[])
  @IsString()
  role?: Role;
}

/** DTO de vérification d'email (lien à usage unique). */
export class VerifyEmailDto {
  @IsString()
  token!: string;
}
