import { Inject, Service } from 'typedi';
import { MongoDal } from '@modulfy/server-dal-mongodb';
import { ServiceResponse } from '@modulfy/server-core-web';
import { PostDocument, PostDataModel } from '../models/Post';
import { UserDocument } from '@modulfy/server-web-user/dist';
import {
    CreateCommentMapper,
    CreateCommentResource, CreatePostMapper,
    CreatePostResource
} from '@modulfy/shared-resources-blog/dist';
import { now } from '@modulfy/shared-dates/dist';
import CommentService from './CommentService';
import { BlogWebModule } from '../index';
import { ModuleContext } from '@modulfy/server-core-module/dist';
import BlogModuleContext from '../module/BlogModuleContext';

@Service()
export default class PostService extends MongoDal<PostDocument> {

    @Inject(type => CommentService)
    protected commentService: CommentService;

    protected context: BlogModuleContext = BlogWebModule.context;

    constructor() {
        super(PostDataModel, BlogWebModule.logger);
    }

    async addLikeToPost(user: UserDocument, postId: string): Promise<ServiceResponse<PostDocument>> {
        const postRes = await this.findById(postId);
        const post = postRes.data;
        if (post.likes.indexOf(user._id.toString()) > -1) {
            return postRes;
        }
        post.likes.push(user._id.toString());
        return this.save(post);
    }

    async removeLikeFromPost(user: UserDocument, postId: string): Promise<ServiceResponse<PostDocument>> {
        const postRes = await this.findById(postId);
        const post = postRes.data;
        post.likes = post.likes.filter(id => id !== user._id.toString());
        return this.save(post);
    }

    async addDislikeToPost(user: UserDocument, postId: string): Promise<ServiceResponse<PostDocument>> {
        const postRes = await this.findById(postId);
        const post = postRes.data;
        if (post.dislikes.indexOf(user._id.toString()) > -1) {
            return postRes;
        }
        post.dislikes.push(user._id.toString());
        return this.save(post);
    }

    async removeDislikeFromPost(user: UserDocument, postId: string): Promise<ServiceResponse<PostDocument>> {
        const postRes = await this.findById(postId);
        const post = postRes.data;
        post.dislikes = post.dislikes.filter(id => id !== user._id.toString());
        return this.save(post);
    }

    async createCommentForPost(user: UserDocument, postId: string, newComment: CreateCommentResource): Promise<ServiceResponse<PostDocument>> {
        const postRes = await this.findById(postId);
        const post = postRes.data;
        if (!post.allowComments) {
            throw new ServiceResponse('Not allowed to comment on this post.', 400);
        }
        const createdComment = await this.commentService.createComment(user, newComment);
        post.comments.push(createdComment.data);
        return this.save(post);
    }

    async validateNewPostConstraints(post: CreatePostResource) {
        if (!post.validated) {
            const error = CreatePostMapper.verifyAllConstraints(post);
            if (error) throw new ServiceResponse(error);
        }
    }

    validateNewPostData(post: CreatePostResource) {
        if (!post.title || post.title.length == 0) throw new ServiceResponse('Please provide a body for the post.', 400);
        if (!post.body || post.body.length == 0) throw new ServiceResponse('Please provide a body for the post.', 400);
        if (post.title.length > this.context.moduleOptions.maxPostTitleLength) {
            throw new ServiceResponse(`The title cannot be longer than ${this.context.moduleOptions.maxPostTitleLength} characters.`);
        }
        if (post.body.length > this.context.moduleOptions.maxPostBodyLength) {
            throw new ServiceResponse(`The body for the post is longer than the allowed ${this.context.moduleOptions.maxPostBodyLength} characters.`);
        }
    }

    async createPost(author: UserDocument, post: CreatePostResource): Promise<ServiceResponse<PostDocument>> {
        return this.insert({
            title: post.title,
            body: post.body,
            allowComments: post.allowComments,
            author: author,
            comments: [],
            likes: [],
            dislikes: [],
            createdOn: now(),
            updatedOn: now()
        });
    }

}
