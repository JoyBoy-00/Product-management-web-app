import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log("🔥 JwtStrategy constructor called");
    super({
      
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.MY_CUSTOM_JWT_KEY,
    });

    console.log("🔑 Using secret key:", process.env.MY_CUSTOM_JWT_KEY);
  }

  async validate(payload: any) {
    console.log("🔑 JWT payload:", payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}