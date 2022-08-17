"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLinkAccount = exports.validateLogin = exports.validateRegistration = void 0;
/* eslint-disable no-use-before-define */
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.validateRegistration = joi_1.default.object({
    firstname: joi_1.default.string().trim().required(),
    lastname: joi_1.default.string().trim().required(),
    email: joi_1.default.string().email().trim().required(),
    password: joi_1.default.string().trim().required(),
});
exports.validateLogin = joi_1.default.object({
    email: joi_1.default.string().email().trim().required(),
    password: joi_1.default.string().trim().required(),
});
exports.validateLinkAccount = joi_1.default.object({
    code: joi_1.default.string().trim().required(),
    updatedBy: joi_1.default.string().required()
});
const userSchema = new mongoose_1.default.Schema({
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
userSchema.statics.build = (attr) => new UserModel(attr);
userSchema.set('collection', 'user');
const UserModel = mongoose_1.default.model('User', userSchema);
// User.build({
//     title: 'some title',
//     description: 'some description'
// });
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map