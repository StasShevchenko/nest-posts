import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma";
import {User} from "@prisma/client";
import {UserDto} from "./dto/userDto";
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

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

    async createUser(user: UserDto): Promise<any> {
        const ifExist = await this.findUserByEmail(user.email)
        if(ifExist) return null
        const hashedPassword = await bcrypt.hash(
            user.password,
            roundsOfHashing
        )
        return this.prismaService.user.create({
            data: {
                ...user,
                password: hashedPassword
            }
        })
    }
}
