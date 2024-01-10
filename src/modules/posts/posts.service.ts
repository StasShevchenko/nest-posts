import { Injectable } from '@nestjs/common';
import {PostDto} from "./dto/post.dto";

@Injectable()
export class PostsService {

    async getPostsList(): Promise<PostDto[]>{
        return [
            {
                title: "first post",
                content: "first post content"
            },
            {
                title: "second post",
                content: "second post content"
            }
        ]
    }
}
