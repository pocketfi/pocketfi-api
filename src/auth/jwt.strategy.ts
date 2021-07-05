import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import { JwtPayload } from './interfaces/payload.interface'
import { User } from '../users/interfaces/user.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload)
    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }
    return user
  }
}
