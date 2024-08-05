import { CommonModule } from '@app/common';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@app/common/strategies';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { FollowingModule } from './following/following.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { FeedModule } from './feed/feed.module';
import { BlacklistModule } from './blacklist/blacklist.module';

@Module({
  imports: [UserModule, ProfileModule, CommonModule, AuthModule, PostModule, FollowingModule, CommentModule, LikeModule, FeedModule, BlacklistModule],
  controllers: [],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule {}
