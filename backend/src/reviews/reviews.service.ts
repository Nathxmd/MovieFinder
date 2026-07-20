import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { MoviesService } from "../movies/movies.service";
import { UpsertReviewDto } from "./dto/upsert-review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moviesService: MoviesService,
  ) {}

  async listByMovie(imdbId: string) {
    const [reviews, aggregate] = await Promise.all([
      this.prisma.review.findMany({
        where: { movieId: imdbId },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.review.aggregate({
        where: { movieId: imdbId },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    return {
      imdbId,
      averageRating: aggregate._avg.rating
        ? Number(aggregate._avg.rating.toFixed(1))
        : 0,
      totalReviews: aggregate._count._all,
      reviews,
    };
  }

  async upsertByMovie(userId: string, imdbId: string, dto: UpsertReviewDto) {
    await this.moviesService.upsertMovie(imdbId, dto);

    return this.prisma.review.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: imdbId,
        },
      },
      create: {
        userId,
        movieId: imdbId,
        rating: dto.rating,
        comment: dto.comment,
      },
      update: {
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async remove(reviewId: string, userId: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw new NotFoundException("Review not found");
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    return { deleted: true };
  }
}
