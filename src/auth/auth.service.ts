import jwt, { JwtPayload } from "jsonwebtoken";

import { UserService } from "src/user";
import { LoginDto } from "./dto";
import { RegisterDto } from "./dto/register.dto";
import { compareSync } from "bcrypt";
import { InvalidEmailOrPassword } from "./exceptions";

class AuthService {
    constructor(private userService: UserService) {}

    public async login(loginDto: LoginDto, deviceId: string) {
        const userCandidate = await this.userService.getUserByEmail(loginDto.email);

        if (!userCandidate) {
            throw new InvalidEmailOrPassword();
        }

        const isPasswordCorrect = compareSync(loginDto.password, userCandidate.password);

        if (!isPasswordCorrect) {
            throw new InvalidEmailOrPassword();
        }

        return {
            access: this.generateAccessToken({
                deviceId,
                userId: userCandidate.id
            })
        }
    }

    public async register(registerDto: RegisterDto) {

    }

    private generateAccessToken(payload: JwtPayload) {
        return jwt.sign(
            payload,
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: '10m'
            }
        )
    }
}

export {
    AuthService
}