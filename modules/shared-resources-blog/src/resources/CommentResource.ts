import { Resource } from '@jrapp/shared-core-resources';
import { UserResource } from '@jrapp/shared-resources-user';

export default class CommentResource extends Resource {

    _id: string;
    body: string;
    user: UserResource;
    allowComments: boolean;
    comments: CommentResource[];
    likes: number;
    dislikes: number;
    createdOn: Date;
    updatedOn: Date;

    init(_id: string, body: string, user: UserResource, allowComments: boolean, comments: CommentResource[], likes: number, dislikes: number, createdOn: Date, updatedOn: Date) {
        this._id = _id;
        this.body = body;
        this.user = user;
        this.allowComments = allowComments;
        this.comments = comments;
        this.likes = likes;
        this.dislikes = dislikes;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        return this;
    }

}
