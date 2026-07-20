import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { MoviesService } from "../movies/movies.service";
import { MovieSnapshotDto } from "../movies/movie-snapshot.dto";

@Injectable()
export class WatchlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moviesService: MoviesService,
  ) {}

  async list(userId: string) {
    return this.prisma.watchlistItem.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async add(userId: string, imdbId: string, dto: MovieSnapshotDto) {
    await this.moviesService.upsertMovie(imdbId, dto);

    return this.prisma.watchlistItem.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: imdbId,
        },
      },
      create: {
        userId,
        movieId: imdbId,
      },
      update: {},
      include: { movie: true },
    });
  }

  async remove(userId: string, imdbId: string) {
    await this.prisma.watchlistItem.deleteMany({
      where: {
        userId,
        movieId: imdbId,
      },
    });

    return { deleted: true };
  }
}
