import { Resource } from '@modulfy/core-resources';
import { UserResource } from '@modulfy/user';

export default class CreateCommentResource extends Resource {

    body: string;
    user: UserResource;
    allowComments: boolean;

    init(body: string, user: UserResource, allowComments: boolean) {
        this.body = body;
        this.user = user;
        this.allowComments = allowComments;
        return this;
    }

}
