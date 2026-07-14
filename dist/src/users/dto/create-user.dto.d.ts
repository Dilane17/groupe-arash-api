import { AdminRole } from '@prisma/client';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
}
