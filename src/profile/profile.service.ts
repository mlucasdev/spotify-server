import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.util';
import { verifyProfileIdInToken } from 'src/utils/verifyProfileIdInToken';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProfileDto) {
    const user = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          profiles: {
            select: {
              id: true,
            },
          },
          userPlan: {
            select: {
              accounts: true,
            },
          },
        },
      })
      .catch(handleError);

    if (user.profiles.length >= user.userPlan.accounts) {
      throw new UnauthorizedException(
        'Profile limits reached for your account type',
      );
    }

    const data: Prisma.ProfileCreateInput = {
      ...dto,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.prisma.profile
      .create({
        data,
        select: {
          id: true,
          name: true,
          image: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      .catch(handleError);
  }

  async findAll(userId: string) {
    const user = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          profiles: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
      .catch(handleError);

    if (user.profiles.length === 0) {
      throw new NotFoundException('No profile found');
    }
    return user;
  }

  async update(userId: string, profileId: string, dto: UpdateProfileDto) {
    verifyProfileIdInToken(profileId);
    this.findOneProfileInUser(userId, profileId);

    const data: Partial<Profile> = { ...dto };

    return await this.prisma.profile
      .update({
        where: { id: profileId },
        data,
        select: {
          id: true,
          name: true,
          image: true,
        },
      })
      .catch(handleError);
  }

  async delete(userId: string, profileId: string) {
    verifyProfileIdInToken(profileId);
    await this.findOneProfileInUser(userId, profileId);
    await this.prisma.profile
      .delete({ where: { id: profileId } })
      .catch(handleError);
  }

  async findOneProfileInUser(userId: string, profileId: string) {
    const userProfile = await this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
        select: {
          profiles: {
            where: {
              id: profileId,
            },
          },
        },
      })
      .catch(handleError);

    if (userProfile.profiles.length === 0) {
      throw new NotFoundException('Profile not found');
    }

    return userProfile.profiles;
  }
}
