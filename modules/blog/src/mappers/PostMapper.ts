import { ResourceMapper } from '@modulfy/core-resources';
import PostResource from '../resources/PostResource';

class PostMapper extends ResourceMapper {

    id = 'PostMapper';
    resourceType = PostResource;

    build(data): PostResource {
        return new PostResource().init(data._id, data.title, data.body, data.author, data.allowComments, data.comments, data.likes, data.dislikes, data.createdOn, data.updatedOn);
    }

}

export default new PostMapper();
