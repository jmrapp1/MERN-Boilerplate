import { Resource } from '@modulfy/core-resources';

export default class TestResource extends Resource {

    message;

    init(message: string) {
        this.message = message;
        return this;
    }

}
