import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, lowercase: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    firstName: String,
    lastName: String,
    phone: String,
    password: String,
});

export interface UserDocument extends mongoose.Document {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
}

userSchema.pre('save', function (next) {
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
});

export function hashPassword(password) {
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

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Omit the password when returning a user
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
    }
});
const User = mongoose.model<UserDocument>('User', userSchema, 'User');

export default User;
