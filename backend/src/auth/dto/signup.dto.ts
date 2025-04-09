import { Role } from '../../common/enums/role.enum';

export class SignupDto {
  email: string;
  password: string;
  role?: Role; // Optional, defaults to USER
}