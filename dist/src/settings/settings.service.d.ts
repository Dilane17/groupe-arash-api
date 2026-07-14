import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get(): Promise<{
        email: string;
        id: string;
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
        email: string;
        id: string;
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
