import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsNotEmpty()
  @MaxLength(50)
  apellido: string;

  @IsEmail()
  email: string; // correo del remitente

  @IsNotEmpty()
  @IsEmail()
  toEmail: string; // nuevo campo, correo del destinatario

  @IsNotEmpty()
  @MaxLength(100)
  asunto: string;

  @IsNotEmpty()
  @MaxLength(1000)
  mensaje: string;
}
