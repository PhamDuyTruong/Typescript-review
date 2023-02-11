import { Post } from './../entities/Post';
import { Mutation, Resolver, Arg, Query, ID} from 'type-graphql';
import { PostMutationResponse } from './../types/PostMutationResponse';
import { CreatePostInput } from './../types/CreatePostInput';

@Resolver()
export class PostResolver{
    @Mutation(_return => PostMutationResponse)
    async createPost(
        @Arg('createPostInput') {title, text}: CreatePostInput
    ){

        try {
            const newPost = Post.create({
                title,
                text
            })
    
            await newPost.save();
            return {
                code: 200,
                success: true,
                message: "Post created successfully",
                post: newPost
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error`,
            };
        }
   
    }

    @Query(_return => [Post])
    async posts(){
        return Post.find();
    }

    @Query(_return => Post, {nullable: true})
    async post(
        @Arg("id", _type=> ID) id: number | undefined
    ){
        const post = await Post.findOne({where: {id}});
        return post
    }
}