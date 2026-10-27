import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'passwordSeguro123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
  })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'juanperez',
    description: 'Nombre de usuario único',
  })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @MaxLength(100)
  username: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Número de teléfono del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @ApiProperty({
    example: 'es',
    description: 'Idioma preferido del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string;

  @ApiProperty({
    example: 'America/Mexico_City',
    description: 'Zona horaria del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;
}