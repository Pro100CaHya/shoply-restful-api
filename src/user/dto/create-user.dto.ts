import { IsEmail, IsEnum, IsString, Length } from "class-validator";

enum USER_ROLE {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN"
}

class CreateUserDto {
    @IsString()
    @IsEmail()
    public readonly email: string;

    @IsString()
    @Length(6, 32)
    public readonly password: string;

    @IsEnum(USER_ROLE)
    public readonly role: USER_ROLE
}

export {
    CreateUserDto
}