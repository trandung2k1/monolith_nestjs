import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto } from 'src/users/user.dto';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Throttle(2, 60)
  @Post('register')
  async register(@Body() userRegister: UserRegisterDto) {
    return await this.authService.register(userRegister);
  }
  @Throttle(5, 60)
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() request) {
    return await this.authService.getProfile(request['user']['userId']);
  }
}
