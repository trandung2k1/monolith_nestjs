import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserLoginDto, UserRegisterDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(userRegisterDto: UserRegisterDto) {
    const findUserByEmail = await this.userModel.findOne({
      email: userRegisterDto.email,
    });
    if (findUserByEmail) {
      throw new HttpException(
        'User already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userRegisterDto.password, salt);
    const newUser = new this.userModel({
      username: userRegisterDto.username,
      email: userRegisterDto.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = savedUser['_doc'];
    return info;
  }
  async login(userLoginDto: UserLoginDto) {
    const findUserByEmail = await this.userModel.findOne({
      email: userLoginDto.email,
    });
    if (!findUserByEmail) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isValidPassword = await bcrypt.compare(
      userLoginDto.password,
      findUserByEmail.password,
    );
    if (!isValidPassword) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = findUserByEmail['_doc'];
    const accessToken = await this.jwtService.signAsync({
      userId: info._id,
      isAdmin: info.isAdmin,
    });
    return { ...info, accessToken };
  }
  async getProfile(userId: string) {
    const findUser = await this.userModel.findOne({ _id: userId });
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = findUser['_doc'];
    return info;
  }
}
