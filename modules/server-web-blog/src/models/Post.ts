import * as mongoose from 'mongoose';
import { Mongoose } from 'mongoose';
import { Container } from 'typedi';
import { Events } from '@jrapp/server-core-events';
import { MongoDataModel, MONGODB_CONNECTED } from '@jrapp/server-dal-mongodb';
import { UserDocument } from '@jrapp/server-web-user/dist';
import { CommentDocument } from './Comment';

export const postSchema = new mongoose.Schema({
    title: { type: String },
    body: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    allowComments: { type: Boolean },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    likes: [{type: String}],
    dislikes: [{type: String}],
    createdOn: { type: Date },
    updatedOn: { type: Date }
});

export interface PostDocument extends mongoose.Document {
    _id: string;
    title: string;
    body: string;
    author: UserDocument;
    allowComments: boolean;
    comments: CommentDocument[];
    likes: string[];
    dislikes: string[];
    createdOn: Date;
    updatedOn: Date;
}

export const PostDataModel = new MongoDataModel<PostDocument>();
PostDataModel.schema = postSchema;

Container.get(Events).listen(MONGODB_CONNECTED, (conn: Mongoose) => {
    PostDataModel.model = conn.model<PostDocument>('Post', postSchema, 'Post');
});
