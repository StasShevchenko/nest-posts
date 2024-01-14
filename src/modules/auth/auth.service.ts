import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService, TokenExpiredError} from "@nestjs/jwt";
import {RegisterUserDto} from "../user/dto/registerUser.dto";
import * as argon from 'argon2';
import {accessJwtSecret, refreshJwtSecret} from "./auth.module";
import {AuthEntity} from "./dto/auth.dto";
import {User} from "@prisma/client";
import {JwtPayloadDto} from "./dto/jwtPayload.dto";


@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    async signIn(email: string, password: string): Promise<AuthEntity> {
        const user = await this.userService.findUserByEmail(email);
        const isPasswordValid = await argon.verify(user?.password ?? "", password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        const authEntity = this.generateAuthEntity(user);
        const hashedRefresh = await argon.hash(
            authEntity.refreshToken,
        )
        await this.userService.updateUser({
            ...user,
            refreshToken: hashedRefresh
        })
        return authEntity
    }

    async register(userData: RegisterUserDto): Promise<AuthEntity> {
        const hashedPassword = await argon.hash(
            userData.password,
        )
        const user = await this.userService.createUser(userData, hashedPassword)
        if (user == null) {
            throw new BadRequestException('User already exists')
        } else {
            const authEntity = this.generateAuthEntity(user)
            const hashedRefresh = await argon.hash(authEntity.refreshToken)
            await this.userService.updateUser({
                ...user,
                refreshToken: hashedRefresh
            })
            return authEntity
        }
    }

    async refresh(refreshToken: string): Promise<AuthEntity> {
        try {
            const userData = await this.jwtService.verify<Promise<JwtPayloadDto>>(refreshToken, {
                secret: refreshJwtSecret
            });
            const user = await this.userService.findUserById(userData.userId)
            const isRefreshValid = await argon.verify(user.refreshToken, refreshToken)
            if (isRefreshValid) {
                const authEntity = this.generateAuthEntity(user)
                const hashedRefresh = await argon.hash(authEntity.refreshToken)
                await this.userService.updateUser({
                    ...user,
                    refreshToken: hashedRefresh
                })
                return authEntity
            } else {
                await this.clearRefresh(user.id)
                throw new BadRequestException()
            }
        } catch (e) {
            const message = (e instanceof TokenExpiredError) ? 'Token is expired' : 'Invalid token'
            throw new BadRequestException(message)
        }
    }

    async clearRefresh(userId: number) {
        try {
            const user = await this.userService.findUserById(userId);
            await this.userService.updateUser({
                ...user,
                refreshToken: null
            })
        } catch (e) {
            throw new BadRequestException()
        }
    }

    private generateAuthEntity(user: User): AuthEntity {
        const jwtPayload: JwtPayloadDto = {
            userId: user.id,
            email: user.email,
            name: user.name
        }
        return {
            accessToken: this.jwtService.sign(jwtPayload, {
                secret: accessJwtSecret,
                expiresIn: '10s'
            }),
            refreshToken: this.jwtService.sign(
                jwtPayload, {
                    secret: refreshJwtSecret,
                    expiresIn: '30d'
                })
        }
    }
}
