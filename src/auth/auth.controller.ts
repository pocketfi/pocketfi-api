import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthUserDto } from './dto/auth-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userRegisterDto: CreateUserDto): Promise<AuthUserDto> {
    return this.authService.register(userRegisterDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<AuthUserDto> {
    return this.authService.login(loginUserDto)
  }
}
