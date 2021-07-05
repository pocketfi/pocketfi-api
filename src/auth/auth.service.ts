import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/payload.interface'
import { LoginUserDto } from './dto/login-user.dto'
import * as bcrypt from 'bcrypt'
import { AuthUserDto } from './dto/auth-user.dto'
import { User } from '../users/interfaces/user.interface'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUser: CreateUserDto): Promise<AuthUserDto> {
    const existingUser = await this.usersService.findOneByEmail(
      registerUser.email,
    )
    if (existingUser) {
      throw new BadRequestException('User already exists')
    }
    const user = await this.usersService.create(registerUser)
    const token = this.#createToken(user.id)
    return new AuthUserDto(token)
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthUserDto> {
    const user = await this.usersService.findOneByEmail(loginUserDto.email)
    if (!user) {
      throw new BadRequestException('Such user does not exists')
    }
    console.log(loginUserDto)
    console.log(user)
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password)
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials')
    }
    const token = this.#createToken(user.id)
    return new AuthUserDto(token)
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.id)
    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }
    return user
  }

  #createToken = (id: string): string => {
    const user: JwtPayload = { id }
    return this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES,
    })
  }
}
