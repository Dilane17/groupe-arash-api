import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ContactModule } from './contact/contact.module';
import { CareersModule } from './careers/careers.module';
import { NewsModule } from './news/news.module';
import { PartnersModule } from './partners/partners.module';
import { MediaModule } from './media/media.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    EmailModule,
    ContactModule,
    CareersModule,
    NewsModule,
    PartnersModule,
    MediaModule,
    NewsletterModule,
    DashboardModule,
    UsersModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
