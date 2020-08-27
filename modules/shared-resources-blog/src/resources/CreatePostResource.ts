import { Resource } from '@jrapp/shared-core-resources';

export default class CreatePostResource extends Resource {

    title: string;
    body: string;
    allowComments: boolean;

    init(title: string, body: string, allowComments: boolean) {
        this.title = title;
        this.body = body;
        this.allowComments = allowComments;
        return this;
    }

}
