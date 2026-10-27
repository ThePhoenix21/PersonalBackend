import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CvModule } from './cv/cv.module';

@Module({
  imports: [AuthModule, UsersModule, CvModule],
  controllers: [],
  providers: [],
})
export class AppModule {}