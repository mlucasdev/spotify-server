import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserPlanModule } from './user-plan/user-plan.module';
import { ProfileModule } from './profile/profile.module';
import { ArtistModule } from './artist/artist.module';
import { CountryModule } from './country/country.module';
import { AlbumModule } from './album/album.module';
import { MusicModule } from './music/music.module';
import { ProfileFavoriteMusicModule } from './profile-favorite-music/profile-favorite-music.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    AdminModule,
    UserPlanModule,
    ProfileModule,
    ArtistModule,
    CountryModule,
    AlbumModule,
    MusicModule,
    ProfileFavoriteMusicModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
