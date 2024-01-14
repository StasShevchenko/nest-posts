import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "./modules/prisma/prisma.module";
import {JwtService} from "@nestjs/jwt";
import {AuthModule} from "./modules/auth/auth.module";
import {UserModule} from "./modules/user/user.module";
import {PostsModule} from "./modules/posts/posts.module";


@Module({
  imports: [
      PrismaModule,
      ConfigModule.forRoot(),
      AuthModule,
      UserModule,
      PostsModule
  ],
    providers: [
        JwtService,
    ]
})
export class AppModule {}
