import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private resend;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean>;
}
