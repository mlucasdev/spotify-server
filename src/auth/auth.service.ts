import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async LoginUser(loginDto: LoginDto): Promise<LoginUserResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email and/or password!');
    }

    const isHashValid = await bcrypt.compare(password, user.password);

    if (!isHashValid) {
      throw new UnauthorizedException('Imvalid email and/or password!');
    }

    delete user.password;

    return {
      token: this.jwt.sign({ email }),
      user,
    };
  }

  async LoginAdmin(loginDto: LoginDto): Promise<LoginAdminResponseDto> {
    const { email, password } = loginDto;

    const admin = await this.prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid CPF and/or password!');
    }

    const isHashValid = await bcrypt.compare(password, admin.password);

    if (!isHashValid) {
      throw new UnauthorizedException('Imvalid CPF and/or password!');
    }

    delete admin.password;

    return {
      token: this.jwt.sign({ email }),
      admin,
    };
  }
}
