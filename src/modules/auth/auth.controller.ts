import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {RegisterUserDto} from "../user/dto/registerUser.dto";
import {AuthEntity} from "./dto/auth.dto";
import {RefreshDto} from "./dto/refresh.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('login')
    login(@Body(){email, password}: LoginDto): Promise<AuthEntity>{
        return this.authService.signIn(email, password)
    }

    @Post('register')
    register(@Body() user: RegisterUserDto): Promise<AuthEntity>{
        return this.authService.register(user)
    }

    @Post('refresh')
    refresh(@Body() refresh: RefreshDto): Promise<AuthEntity>{
        return this.authService.refresh(refresh.refreshToken)
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(
        @Req() request
    ){
        return this.authService.clearRefresh(request.user.userId)
    }
}
