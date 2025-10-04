import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TemplateService } from './template.service';
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  providers: [MailService, TemplateService],
  exports: [MailService],
})
export class MailModule {}
