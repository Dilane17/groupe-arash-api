import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalContacts,
      unreadContacts,
      totalApplications,
      newApplications,
      totalSubscribers,
      recentContacts,
      recentApplications,
    ] = await Promise.all([
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { status: 'NEW' } }),
      this.prisma.jobApplication.count(),
      this.prisma.jobApplication.count({ where: { status: 'RECEIVED' } }),
      this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      this.prisma.contactMessage.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, fullName: true, subject: true, createdAt: true, status: true },
      }),
      this.prisma.jobApplication.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, fullName: true, jobOffer: { select: { title: true } }, createdAt: true, status: true },
      }),
    ]);

    // Format recent activity feed
    const activityFeed = [
      ...recentContacts.map(c => ({
        id: `contact-${c.id}`,
        type: 'contact',
        name: c.fullName,
        description: c.subject,
        date: c.createdAt,
        isNew: c.status === 'NEW',
      })),
      ...recentApplications.map(a => ({
        id: `app-${a.id}`,
        type: 'application',
        name: a.fullName,
        description: a.jobOffer?.title || 'Candidature spontanée',
        date: a.createdAt,
        isNew: a.status === 'RECEIVED',
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    // Chart Data (Messages & Applications over last 30 days)
    const contactsLast30Days = await this.prisma.contactMessage.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });

    const applicationsLast30Days = await this.prisma.jobApplication.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });

    // Group by day for chart
    const chartMap = new Map<string, { date: string; contacts: number; applications: number }>();
    
    // Initialize map with last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      chartMap.set(dateString, { date: dateString, contacts: 0, applications: 0 });
    }

    contactsLast30Days.forEach(c => {
      const d = c.createdAt.toISOString().split('T')[0];
      if (chartMap.has(d)) {
        chartMap.get(d)!.contacts++;
      }
    });

    applicationsLast30Days.forEach(a => {
      const d = a.createdAt.toISOString().split('T')[0];
      if (chartMap.has(d)) {
        chartMap.get(d)!.applications++;
      }
    });

    return {
      metrics: {
        totalContacts,
        unreadContacts,
        totalApplications,
        newApplications,
        totalSubscribers,
      },
      activityFeed,
      chartData: Array.from(chartMap.values()),
    };
  }
}
