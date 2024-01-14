import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {RegisterUserDto} from "../user/dto/registerUser.dto";
import {AuthEntity} from "./dto/auth.dto";
import {RefreshDto} from "./dto/refresh.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('login')
    @ApiCreatedResponse({type: AuthEntity})
    login(@Body(){email, password}: LoginDto): Promise<AuthEntity>{
        return this.authService.signIn(email, password)
    }

    @Post('register')
    @ApiCreatedResponse({type: AuthEntity})
    register(@Body() user: RegisterUserDto): Promise<AuthEntity>{
        return this.authService.register(user)
    }

    @Post('refresh')
    @ApiCreatedResponse({type: AuthEntity})
    refresh(@Body() refresh: RefreshDto): Promise<AuthEntity>{
        return this.authService.refresh(refresh.refreshToken)
    }

    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({
        description: 'After being called, it will remove refresh' +
            ' token from database, making any client refresh token invalid'})
    @UseGuards(JwtAuthGuard)
    logout(
        @Req() request
    ){
        return this.authService.clearRefresh(request.user.userId)
    }
}
