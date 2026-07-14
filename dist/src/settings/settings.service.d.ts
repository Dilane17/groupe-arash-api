import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get(): Promise<{
        id: string;
        email: string;
        updatedAt: Date;
        phone: string;
        address: string;
        city: string;
        linkedinUrl: string;
        facebookUrl: string;
        instagramUrl: string;
        youtubeUrl: string;
    }>;
    update(dto: UpdateSettingsDto): Promise<{
        id: string;
        email: string;
        updatedAt: Date;
        phone: string;
        address: string;
        city: string;
        linkedinUrl: string;
        facebookUrl: string;
        instagramUrl: string;
        youtubeUrl: string;
    }>;
}
