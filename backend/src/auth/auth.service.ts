import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role || Role.USER;

    const user = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      role,
    });

    return { message: 'Signup successful', email: user.email, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
  
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { sub: user._id, email: user.email, role: user.role };
  
    const token = this.jwtService.sign(payload);
  
    return {
      token,
      role: user.role, // ✅ Add this
    };
  }
}