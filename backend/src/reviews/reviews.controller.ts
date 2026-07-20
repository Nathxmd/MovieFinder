import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpsertReviewDto } from "./dto/upsert-review.dto";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(":imdbId")
  listByMovie(@Param("imdbId") imdbId: string) {
    return this.reviewsService.listByMovie(imdbId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":imdbId")
  upsertByMovie(
    @Param("imdbId") imdbId: string,
    @Body() dto: UpsertReviewDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.reviewsService.upsertByMovie(user.userId, imdbId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":reviewId")
  remove(
    @Param("reviewId") reviewId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.reviewsService.remove(reviewId, user.userId);
  }
}
