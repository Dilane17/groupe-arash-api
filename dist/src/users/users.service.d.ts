import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.AdminRole;
        createdAt: Date;
    }[]>;
    create(dto: CreateUserDto): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.AdminRole;
        createdAt: Date;
    }>;
    remove(id: string, requesterId: string): Promise<{
        success: boolean;
    }>;
}
