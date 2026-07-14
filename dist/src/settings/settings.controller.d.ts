import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
