import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
