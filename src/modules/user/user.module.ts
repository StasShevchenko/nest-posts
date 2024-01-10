import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {PrismaService} from "../prisma/prisma";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaModule]
})
export class UserModule {}
