import { Body, Controller, Post, UsePipes, ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MailService } from './mail.service';
import { ContactDto } from './dto/contact.dto';
import escape from 'escape-html';

@Controller('contact')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  private isAllowedContactEmail(toEmail: string): boolean {
    const allowed = (process.env.ALLOWED_CONTACT_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    return allowed.includes(toEmail.trim().toLowerCase());
  }

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async sendContactEmail(@Body() contactData: ContactDto) {
    try {
      const { nombre, apellido, email, asunto, mensaje, toEmail } = contactData;

      if (!this.isAllowedContactEmail(toEmail)) {
        this.logger.warn(`Intento de contacto con destinatario no permitido: ${toEmail}`);
        throw new BadRequestException('Destinatario no permitido');
      }

      // Escapamos HTML para seguridad
      const emailContent = `
        <h2>Nuevo mensaje de tu portfolio</h2>
        <p><strong>De:</strong> ${escape(nombre)} ${escape(apellido)} (${escape(email)})</p>
        <p><strong>Asunto:</strong> ${escape(asunto)}</p>
        <h4>Mensaje:</h4>
        <p>${escape(mensaje).replace(/\n/g, '<br>')}</p>
      `;

      await this.mailService.sendCustomEmail(
        toEmail, // ahora se usa el correo del DTO
        `Contacto: ${escape(asunto)}`,
        emailContent
      );

      this.logger.log(`Mensaje de contacto enviado de ${email} a ${toEmail}`);
      
      return { success: true, message: 'Mensaje enviado correctamente' };
    } catch (error) {
      this.logger.error('Error al enviar mensaje de contacto:', error);
      throw new BadRequestException('No se pudo enviar el mensaje. Por favor, intente nuevamente más tarde.');
    }
  }
}