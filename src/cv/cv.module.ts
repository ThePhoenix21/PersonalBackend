import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
  imports: [ConfigModule],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
