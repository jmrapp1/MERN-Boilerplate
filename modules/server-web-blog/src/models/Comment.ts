import * as mongoose from 'mongoose';
import { Mongoose } from 'mongoose';
import { Container } from 'typedi';
import { Events } from '@modulfy/server-core-events';
import { MongoDataModel, MONGODB_CONNECTED } from '@modulfy/server-dal-mongodb';
import { UserDataModel } from '@modulfy/server-web-user';

export interface CommentDocument extends mongoose.Document {
    _id: string;
    body: string;
    user: any;
    allowComments: boolean;
    comments: CommentDocument[];
    likes: string[];
    dislikes: string[];
    createdOn: Date;
    updatedOn: Date;
}

export const CommentDataModel = new MongoDataModel<CommentDocument>();

export const commentSchema = new mongoose.Schema({
    body: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    allowComments: { type: Boolean },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    likes: [{type: String}],
    dislikes: [{type: String}],
    createdOn: { type: Date },
    updatedOn: { type: Date }
});

CommentDataModel.schema = commentSchema;

Container.get(Events).listen(MONGODB_CONNECTED, (conn: Mongoose) => {
    CommentDataModel.model = conn.model<CommentDocument>('Comment', commentSchema, 'Comment');
});
