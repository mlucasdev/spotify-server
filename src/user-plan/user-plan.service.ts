import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.util';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
import { UpdateUserPlanDto } from './dto/update-user-plan.dto';

@Injectable()
export class UserPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserPlanDto) {
    try {
      const data: CreateUserPlanDto = {
        ...dto,
      };

      return await this.prisma.userPlan.create({ data });
    } catch (error) {
      handleError(error);
    }
  }

  findAll() {
    return `This action returns all userPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPlan`;
  }

  update(id: number, updateUserPlanDto: UpdateUserPlanDto) {
    return `This action updates a #${id} userPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPlan`;
  }
}
