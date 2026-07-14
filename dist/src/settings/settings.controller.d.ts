import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
