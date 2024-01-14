import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class RegisterUserDto {

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiPropertyOptional()
    name?: string
}