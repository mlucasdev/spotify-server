import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.util';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class HomePageService {
  constructor(private readonly prisma: PrismaService) {}

  async homePage(userId: string, profileId: string) {
    await this.findOneProfileInUser(userId, profileId);

    const playlists = await this.prisma.profile
      .findUnique({
        where: { id: profileId },
        select: {
          playlists: {
            select: {
              id: true,
              name: true,
              image: true,
              _count: {
                select: {
                  songs: true,
                },
              },
            },
          },
          favoritePlaylists: {
            select: {
              playlist: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  _count: {
                    select: {
                      songs: true,
                    },
                  },
                },
              },
            },
          },
          songs: {
            select: {
              song: {
                select: {
                  id: true,
                  name: true,
                  songUrl: true,
                },
              },
            },
            take: 10,
            skip: 0,
          },
        },
      })
      .catch(handleError);

    const playlistsSpotify = await this.prisma.profile
      .findUnique({
        where: { userSpotify: true },
        select: {
          playlists: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
      .catch(handleError);

    const artists = await this.prisma.artist
      .findMany({
        select: {
          id: true,
          name: true,
        },
        take: 10,
        skip: 0,
      })
      .catch(handleError);

    const musicCategories = await this.prisma.category
      .findMany({
        select: {
          id: true,
          name: true,
        },
        take: 10,
        skip: 0,
      })
      .catch(handleError);

    return [playlists, { playlistsSpotify }, { artists }, { musicCategories }];
  }

  async searchPlaylistSongAlbumArtist(dto: SearchDto) {
    const songs = await this.prisma.song
      .findMany({
        orderBy: [
          {
            name: 'asc',
          },
        ],
        where: {
          name: {
            startsWith: `${dto.search}`,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          album: {
            select: {
              image: true,
            },
          },
          artist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      .catch(handleError);

    const artists = await this.prisma.artist
      .findMany({
        orderBy: [
          {
            name: 'asc',
          },
        ],
        where: {
          name: {
            startsWith: `${dto.search}`,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      })
      .catch(handleError);

    const playlists = await this.prisma.playlist
      .findMany({
        orderBy: [
          {
            name: 'asc',
          },
        ],
        where: {
          name: {
            startsWith: `${dto.search}`,
            mode: 'insensitive',
          },
          NOT: {
            private: true,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      })
      .catch(handleError);

    const albums = await this.prisma.album
      .findMany({
        orderBy: [
          {
            name: 'asc',
          },
        ],
        where: {
          name: {
            startsWith: `${dto.search}`,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          artist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      .catch(handleError);

    if (
      songs.length === 0 &&
      artists.length === 0 &&
      playlists.length === 0 &&
      albums.length === 0
    ) {
      throw new NotFoundException('Nothing was found');
    }

    return [{ songs }, { artists }, { playlists }, { albums }];
  }

  async findOneProfileInUser(userId: string, profileId: string) {
    const record = await this.prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          profiles: {
            where: {
              id: profileId,
            },
          },
        },
      })
      .catch(handleError);

    if (record.profiles.length === 0) {
      throw new NotFoundException(`Profile with ID '${profileId}' not found`);
    }
  }
}
