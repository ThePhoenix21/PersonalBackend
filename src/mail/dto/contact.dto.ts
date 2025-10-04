import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsNotEmpty()
  @MaxLength(50)
  apellido: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(100)
  asunto: string;

  @IsNotEmpty()
  @MaxLength(1000)
  mensaje: string;
}
