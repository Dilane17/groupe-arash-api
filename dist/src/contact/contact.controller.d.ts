import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { ContactMessageStatus } from '@prisma/client';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<{
        success: boolean;
        id: string;
    }>;
    findAll(page?: string, limit?: string, status?: ContactMessageStatus): Promise<{
        data: {
            id: string;
            email: string;
            createdAt: Date;
            message: string;
            subject: string;
            fullName: string;
            status: import("@prisma/client").$Enums.ContactMessageStatus;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, updateContactStatusDto: UpdateContactStatusDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        subject: string;
        fullName: string;
        status: import("@prisma/client").$Enums.ContactMessageStatus;
    }>;
}
