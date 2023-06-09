import { Injectable } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async register(userRegister: UserRegisterDto) {
    return await this.usersService.register(userRegister);
  }
  async login(userLoginDto: UserLoginDto) {
    return await this.usersService.login(userLoginDto);
  }
  async getProfile(userId: string) {
    return await this.usersService.getProfile(userId);
  }
}
