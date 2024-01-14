import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma";
import {User} from "@prisma/client";
import {RegisterUserDto} from "./dto/registerUser.dto";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {
    }

    async findUserByEmail(email: string): Promise<User | null>{
        return this.prismaService.user.findFirst({where: {email: email}});
    }

    async findUserById(userId: number): Promise<User | null>{
        return this.prismaService.user.findFirst({where: {id: userId}})
    }

    async updateUser(user: User): Promise<User>{
        return this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                ...user
            }
        })
    }

    async createUser(user: RegisterUserDto, hashedPassword: string): Promise<any> {
        const ifExist = await this.findUserByEmail(user.email)
        if(ifExist) return null
        return this.prismaService.user.create({
            data: {
                ...user,
                password: hashedPassword
            }
        })
    }
}
