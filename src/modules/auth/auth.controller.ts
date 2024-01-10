import {Body, Controller, Post, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";
import {UserDto} from "../user/dto/userDto";
import {AuthEntity} from "./dto/auth.dto";
import {RefreshDto} from "./dto/refresh.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('login')
    login(@Body(){email, password}: LoginDto): Promise<AuthEntity>{
        return this.authService.signIn(email, password)
    }

    @Post('register')
    register(@Body() user: UserDto): Promise<AuthEntity>{
        return this.authService.register(user)
    }

    @Post('refresh')
    refresh(@Body() refresh: RefreshDto): Promise<AuthEntity>{
        return this.authService.refresh(refresh.refreshToken)
    }
}
