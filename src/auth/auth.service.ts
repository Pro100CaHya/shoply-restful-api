import jwt from "jsonwebtoken";

import { UserService } from "src/user";
import { LoginDto } from "./dto";
import { RegisterDto } from "./dto/register.dto";
import { compareSync } from "bcrypt";
import { InvalidEmailOrPassword } from "./exceptions";
import { JwtPayload } from "src/interfaces";
import { UserSessionRepository } from "src/user-session";

class AuthService {
    constructor(
        private userService: UserService,
        private userSessionRepository: UserSessionRepository
    ) {}

    public async login(loginDto: LoginDto, device: string) {
        const userCandidate = await this.userService.getUserByEmail(loginDto.email);

        if (!userCandidate) {
            throw new InvalidEmailOrPassword();
        }

        const isPasswordCorrect = compareSync(loginDto.password, userCandidate.password);

        if (!isPasswordCorrect) {
            throw new InvalidEmailOrPassword();
        }

        const existedSession = await this.userSessionRepository.getUserSessionByDeviceAndUserId(device, userCandidate.id);

        if (existedSession) {
            await 
        }

        const jwtPayload = {
            device,
                user: {
                    id: userCandidate.id,
                    role: userCandidate.role
                }
        };

        const accessToken = this.generateAccessToken(jwtPayload);
        const refreshToken = this.generateRefreshToken(jwtPayload);

        await this.userSessionRepository.createUserSession({
            device,
            refreshToken,
            userId: userCandidate.id
        })

        return {
            access: accessToken,
            refresh: refreshToken
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

    private generateRefreshToken(payload: JwtPayload) {
        return jwt.sign(
            payload,
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1h'
            }
        )
    }
}

export {
    AuthService
}