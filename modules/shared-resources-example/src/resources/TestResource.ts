import { Resource } from '@modulfy/shared-core-resources';

export default class TestResource extends Resource {

    message;

    init(message: string) {
        this.message = message;
        return this;
    }

}
