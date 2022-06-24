import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedUser } from 'src/auth/logged-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new logged in user profile',
  })
  create(@LoggedUser() user: User, @Body() dto: ProfileDto) {
    return this.profileService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch all profiles of the logged in user',
  })
  findAll(@LoggedUser() user: User) {
    return this.profileService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Fetch a profile of the logged in user, by the profile id',
  })
  findOne(@LoggedUser() user: User, @Param('id') profileId: string) {
    return this.profileService.findOne(user.id, profileId);
  }
}
