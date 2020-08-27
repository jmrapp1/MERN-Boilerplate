import { ResourceMapper } from '@modulfy/shared-core-resources';
import CreatePostResource from '../resources/CreatePostResource';

class CreatePostMapper extends ResourceMapper {

    id = 'CreatePostMapper';
    resourceType = CreatePostResource;

    build(data): CreatePostResource {
        return new CreatePostResource().init(data.title, data.body, data.allowComments);
    }

}

export default new CreatePostMapper();
