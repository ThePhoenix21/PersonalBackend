import { Controller, Get, Logger, NotFoundException, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { CvService } from './cv.service';

@Controller('cv')
export class CvController {
  private readonly logger = new Logger(CvController.name);

  constructor(private readonly cvService: CvService) {}

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async getCv(@Res() res: Response) {
    let stream: Awaited<ReturnType<CvService['getCvStream']>>;

    try {
      stream = await this.cvService.getCvStream();
    } catch (error: any) {
      if (error?.name === 'NoSuchKey' || error?.$metadata?.httpStatusCode === 404) {
        throw new NotFoundException('El CV no está disponible actualmente.');
      }
      this.logger.error('Error al obtener el CV del bucket:', error);
      throw error;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="CV-James-Cordova.pdf"');

    stream.on('error', (error) => {
      this.logger.error('Error al transmitir el CV:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'No se pudo transmitir el CV.' });
      } else {
        res.destroy();
      }
    });

    stream.pipe(res);
  }
}
