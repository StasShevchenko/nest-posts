import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {UserDto} from "../user/dto/userDto";
import * as bcrypt from 'bcrypt';
import {jwtSecret} from "./auth.module";
import {AuthEntity} from "./dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    async signIn(email: string, password: string): Promise<AuthEntity> {
        const user = await this.userService.findUserByEmail(email);
        const isPasswordValid = await bcrypt.compare(password, user?.password ?? "")
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return {
            accessToken: this.jwtService.sign({userId: user.id, email: user.email}, {
                secret: jwtSecret,
                expiresIn: '10m',
            }),
            refreshToken: this.jwtService.sign({userId: user.id, email: user.email}, {
                secret: jwtSecret,
                expiresIn: '30d',
            })
        }
    }

    async register(userData: UserDto): Promise<AuthEntity> {
        const user = await this.userService.createUser(userData)
        if (user == null) {
            throw new BadRequestException()
        } else {
            return {
                accessToken: this.jwtService.sign({userId: user.id, email: user.email}, {
                    secret: jwtSecret,
                    expiresIn: '10m'
                }),
                refreshToken: this.jwtService.sign({userId: user.id, email: user.email}, {
                    secret: jwtSecret,
                    expiresIn: '30d'
                })
            }
        }
    }

    async refresh(refreshToken: string): Promise<AuthEntity>{
        try {
            const user = await this.jwtService.verify(refreshToken, {
                secret: jwtSecret
            });
            if (!user) {
                throw new BadRequestException()
            }
            return {
                accessToken: this.jwtService.sign({userId: user.id, email: user.email}, {
                    secret: jwtSecret,
                    expiresIn: '10m'
                }),
                refreshToken: this.jwtService.sign({userId: user.id, email: user.email}, {
                    secret: jwtSecret,
                    expiresIn: '30d'
                })
            };
        } catch (e){
            console.log(e)
            throw new BadRequestException()
        }
    }
}
