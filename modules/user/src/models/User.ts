import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import { MongoDataModel, MongoDataModelBuilder} from '@modulfy/dal-mongodb';
import { StringField } from '@modulfy/core-repository';

/*export const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, lowercase: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    firstName: String,
    lastName: String,
    phone: String,
    password: String,
});*/

export interface UserDocument extends mongoose.Document {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
}

function onPreSave(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    hashPassword((user as any).password).then(hash => {
        (user as any).password = hash;
        next();
    }, err => {
        return next(err);
    });
}

function hashPassword(password) {
    return new Promise<String>((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, function (error, hash) {
                if (error) {
                    return reject(error);
                }
                resolve(hash);
            });
        });
    });
}

const dataModel: MongoDataModel<UserDocument> = new MongoDataModelBuilder<UserDocument>()
    .withName('User')
    .onPreEvent('save', onPreSave)
    .addField('username', new StringField({ unique: true, lowercase: true }))
    .addField('email', new StringField({ unique: true, lowercase: true }))
    .addField('firstName', new StringField())
    .addField('lastName', new StringField())
    .addField('phone', new StringField())
    .addField('password', new StringField())
    .build();

dataModel.schema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

dataModel.schema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

export default dataModel;
