import { Resource } from '@jrapp/shared-core-resources';
import { UserResource } from '@jrapp/shared-resources-user';

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
