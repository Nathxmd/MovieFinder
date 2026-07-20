import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { MoviesModule } from "./movies/movies.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { WatchlistModule } from "./watchlist/watchlist.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    MoviesModule,
    ReviewsModule,
    WatchlistModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
