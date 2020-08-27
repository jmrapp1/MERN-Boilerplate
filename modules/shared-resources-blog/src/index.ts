import { ResourceMappingManager } from '@jrapp/shared-core-resources';
import CommentMapper from './mappers/CommentMapper';
import PostMapper from './mappers/PostMapper';
import CommentResource from './resources/CommentResource';
import PostResource from './resources/PostResource';
import CreatePostMapper from './mappers/CreatePostMapper';
import CreateCommentMapper from './mappers/CreateCommentMapper';
import CreatePostResource from './resources/CreatePostResource';
import CreateCommentResource from './resources/CreateCommentResource';

ResourceMappingManager.addMapper(
    CommentMapper,
    PostMapper,
    CreatePostMapper,
    CreateCommentMapper
);

export {
    CommentMapper,
    PostMapper,
    CreatePostMapper,
    CreateCommentMapper,
    CommentResource,
    PostResource,
    CreatePostResource,
    CreateCommentResource
}