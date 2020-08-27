import { ResourceMapper } from '@jrapp/shared-core-resources';
import CreateCommentResource from '../resources/CreateCommentResource';

class CreateCommentMapper extends ResourceMapper {

    id = 'CreateCommentMapper';
    resourceType = CreateCommentResource;

    build(data): CreateCommentResource {
        return new CreateCommentResource().init(data.body, data.user, data.allowComments);
    }

}

export default new CreateCommentMapper();
