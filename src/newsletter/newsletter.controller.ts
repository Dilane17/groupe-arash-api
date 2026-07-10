import { Controller, Post, Body, Get, UseGuards, Query, Res, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterEmailDto } from './dto/newsletter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import type { Response } from 'express';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @Throttle({ default: { limit: 3, ttl: 600000 } })
  @ApiOperation({ summary: 'S\'abonner à la newsletter' })
  @ApiResponse({ status: 201, description: 'Abonnement réussi' })
  subscribe(@Body() dto: NewsletterEmailDto) {
    return this.newsletterService.subscribe(dto);
  }

  @Post('unsubscribe')
  @ApiOperation({ summary: 'Se désabonner de la newsletter' })
  @ApiResponse({ status: 201, description: 'Désabonnement pris en compte' })
  unsubscribe(@Body() dto: NewsletterEmailDto) {
    return this.newsletterService.unsubscribe(dto);
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN, AdminRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les abonnés actifs (paginé)' })
  getSubscribers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.newsletterService.getSubscribers(page, limit);
  }

  @Get('subscribers/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exporter les abonnés en CSV' })
  async exportSubscribers(@Res() res: Response) {
    const csv = await this.newsletterService.exportSubscribers();
    res.header('Content-Type', 'text/csv');
    res.attachment('newsletter_subscribers.csv');
    return res.send(csv);
  }
}
