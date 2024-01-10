import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategy/jwt.strategy";

export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        PassportModule,
        JwtModule,
        UserModule],
})
export class AuthModule {
}
