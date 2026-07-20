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
import { MovieSnapshotDto } from "../movies/movie-snapshot.dto";
import { WatchlistService } from "./watchlist.service";

@Controller("watchlist")
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.watchlistService.list(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":imdbId")
  add(
    @Param("imdbId") imdbId: string,
    @Body() dto: MovieSnapshotDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.watchlistService.add(user.userId, imdbId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":imdbId")
  remove(
    @Param("imdbId") imdbId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.watchlistService.remove(user.userId, imdbId);
  }
}
