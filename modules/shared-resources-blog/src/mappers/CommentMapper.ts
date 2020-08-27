import { ResourceMapper } from '@jrapp/shared-core-resources';
import CommentResource from '../resources/CommentResource';

class CommentMapper extends ResourceMapper {

    id = 'CommentMapper';
    resourceType = CommentResource;

    build(data): CommentResource {
        return new CommentResource().init(data._id, data.body, data.user, data.allowComments, data.comments, data.likes, data.dislikes, data.createdOn, data.updatedOn);
    }

}

export default new CommentMapper();
