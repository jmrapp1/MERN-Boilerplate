import { Service } from 'typedi';
import { MongoDal } from '@modulfy/dal-mongodb';
import { ServiceResponse } from '@modulfy/core-web';
import { UserDocument } from '@modulfy/user';
import { BlogWebModule, CommentDocument, CommentDataModel } from '..';
import BlogModuleContext from '../module/BlogModuleContext';
import CreateCommentResource from '../resources/CreateCommentResource';
import CreateCommentMapper from '../mappers/CreateCommentMapper';

@Service()
export default class CommentService extends MongoDal<CommentDocument> {

    protected context: BlogModuleContext = BlogWebModule.context;

    constructor() {
        super(CommentDataModel, BlogWebModule.logger);
    }

    async addLikeToComment(user: UserDocument, commentId: string): Promise<ServiceResponse<CommentDocument>> {
        const commentRes = await this.findById(commentId);
        const comment = commentRes.data;
        if (comment.likes.indexOf(user._id.toString()) > -1) {
            return commentRes;
        }
        comment.likes.push(user._id.toString());
        return this.save(comment);
    }

    async removeLikeFromComment(user: UserDocument, commentId: string): Promise<ServiceResponse<CommentDocument>> {
        const commentRes = await this.findById(commentId);
        const comment = commentRes.data;
        comment.likes = comment.likes.filter(id => id !== user._id.toString());
        return this.save(comment);
    }

    async addDislikeToComment(user: UserDocument, commentId: string): Promise<ServiceResponse<CommentDocument>> {
        const commentRes = await this.findById(commentId);
        const comment = commentRes.data;
        if (comment.dislikes.indexOf(user._id.toString()) > -1) {
            return commentRes;
        }
        comment.dislikes.push(user._id.toString());
        return this.save(comment);
    }

    async removeDislikeFromComment(user: UserDocument, commentId: string): Promise<ServiceResponse<CommentDocument>> {
        const commentRes = await this.findById(commentId);
        const comment = commentRes.data;
        comment.dislikes = comment.dislikes.filter(id => id !== user._id.toString());
        return this.save(comment);
    }

    async createCommentForComment(user: UserDocument, commentId: string, newComment: CreateCommentResource): Promise<ServiceResponse<CommentDocument>> {
        const commentRes = await this.findById(commentId);
        const comment = commentRes.data;
        if (!comment.allowComments) {
            throw new Error('Not allowed to comment.');
        }
        const createdComment = await this.createComment(user, newComment);
        comment.comments.push(createdComment.data);
        this.save(comment);
        return createdComment;
    }

    async validateNewCommentConstraints(comment: CreateCommentResource) {
        if (!comment.validated) {
            const error = CreateCommentMapper.verifyAllConstraints(comment);
            if (error) throw new ServiceResponse(error);
        }
    }

    validateNewCommentData(comment: CreateCommentResource) {
        if (!comment.body || comment.body.length == 0) throw new ServiceResponse('Please provide a message for the comment.', 400);
        if (comment.body.length > this.context.moduleOptions.maxCommentBodyLength) {
            throw new ServiceResponse(`The body for the comment is longer than the allowed ${this.context.moduleOptions.maxCommentBodyLength} characters.`);
        }
    }

    async createComment(user: UserDocument, comment: CreateCommentResource): Promise<ServiceResponse<CommentDocument>> {
        return this.insert({
            body: comment.body,
            allowComments: comment.allowComments,
            user: comment.user,
            comments: [],
            likes: [],
            dislikes: [],
            createdOn: Date.now(),
            updatedOn: Date.now()
        });
    }

}
