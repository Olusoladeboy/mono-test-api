/* eslint-disable no-use-before-define */
import Joi from 'joi';
import mongoose from 'mongoose';
import { linkaccountInteface, UserInterface } from './user.types';

interface userModelInterface extends mongoose.Model<UserDoc> {
    build(attr: UserInterface): UserDoc
}

export interface UserDoc extends mongoose.Document, UserInterface {
}

export const validateRegistration = Joi.object<UserInterface>({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
});

export const validateLogin = Joi.object<UserInterface>({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
});

export const validateLinkAccount = Joi.object<linkaccountInteface | any>({
    code: Joi.string().trim().required(),
    updatedBy: Joi.string().required()
});

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    linked_account: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        unique: true
    }
});

userSchema.statics.build = (attr: UserInterface) => new UserModel(attr);
userSchema.set('collection', 'user');
const UserModel = mongoose.model<UserDoc, userModelInterface>('User', userSchema);

// User.build({
//     title: 'some title',
//     description: 'some description'
// });

export default UserModel;