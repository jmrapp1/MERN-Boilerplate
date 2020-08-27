import { Container } from 'typedi';
import { Events, EVENT_INITIALIZED } from '@modulfy/server-core-events';
import PostService from './services/PostService';
import CommentService from './services/CommentService';
import { PostDataModel, PostDocument } from './models/Post';
import { CommentDataModel, CommentDocument } from './models/Comment';
import BlogModule from './module/BlogModule';

export const BlogWebModule = new BlogModule('Web-Blog', 'rgba(58,154,33,0.64)');

Container.get(Events).once(EVENT_INITIALIZED, () => {
    BlogWebModule.logger.info('Initialized.');
});

export {
    PostService,
    CommentService,
    PostDataModel,
    CommentDataModel,
    PostDocument,
    CommentDocument
}