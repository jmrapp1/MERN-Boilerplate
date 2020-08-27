import { Resource } from '@jrapp/shared-core-resources';
import { UserResource } from '@jrapp/shared-resources-user';
import CommentResource from './CommentResource';

export default class PostResource extends Resource {

    _id: string;
    title: string;
    body: string;
    author: UserResource;
    allowComments: boolean;
    comments: CommentResource[];
    likes: number;
    dislikes: number;
    createdOn: Date;
    updatedOn: Date;

    init(_id: string, title: string, body: string, author: UserResource, allowComments: boolean, comments: CommentResource[], likes: number, dislikes: number, createdOn: Date, updatedOn: Date) {
        this._id = _id;
        this.title = title;
        this.body = body;
        this.author = author;
        this.allowComments = allowComments;
        this.comments = comments;
        this.likes = likes;
        this.dislikes = dislikes;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        return this;
    }

}
