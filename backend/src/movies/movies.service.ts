import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { MovieSnapshotDto } from "./movie-snapshot.dto";

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMovie(imdbId: string, movie: MovieSnapshotDto) {
    if (!movie?.title) {
      throw new BadRequestException("Movie snapshot is required");
    }

    const movieData = this.buildMovieData(imdbId, movie);

    return this.prisma.movie.upsert({
      where: { imdbId },
      create: movieData,
      update: movieData as Prisma.MovieUncheckedUpdateInput,
    });
  }

  private buildMovieData(
    imdbId: string,
    movie: MovieSnapshotDto,
  ): Prisma.MovieUncheckedCreateInput {
    return {
      imdbId,
      title: movie.title,
      poster: movie.poster ?? null,
      year: movie.year ?? null,
      genre: movie.genre ?? null,
      plot: movie.plot ?? null,
      director: movie.director ?? null,
      actors: movie.actors ?? null,
    };
  }
}
