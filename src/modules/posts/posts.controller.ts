import {Controller, Get, UseGuards} from '@nestjs/common';
import {PostsService} from "./posts.service";
import {PostDto} from "./dto/post.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getAllPosts(): Promise<PostDto[]>{
        return this.postsService.getPostsList()
    }
}
