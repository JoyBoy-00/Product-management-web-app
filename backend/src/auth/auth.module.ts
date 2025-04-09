import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // ✅ Import this

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret_here',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule, // ✅ Add this
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}