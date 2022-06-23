import { ApiProperty } from '@nestjs/swagger';
import { Admin } from 'src/admin/entities/admin.entity';

export class LoginAdminResponseDto {
  @ApiProperty({
    description: 'JWT generated by login',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Imd1dHMiLCJpYXQiOjE2NTQ4MjQwMDUsImV4cCI6MTY1NDkxMDQwNX0.d3wIQIyk5LqUMcyBYL-yunYNe7JyhMfKMyqP0joN00w',
  })
  token: string;

  @ApiProperty({
    description: 'Authenticated user data',
  })
  admin: Admin;
}