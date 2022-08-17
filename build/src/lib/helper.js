"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.hasProp = exports.isRealValue = exports.hash = void 0;
/* eslint-disable import/prefer-default-export */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hash(str = '') {
    return bcryptjs_1.default.hashSync(str, 5);
}
exports.hash = hash;
function isRealValue(object) {
    return typeof object !== 'undefined' || object !== null;
}
exports.isRealValue = isRealValue;
function hasProp(obj, prop) {
    if (!isRealValue(obj))
        return false;
    return (obj[prop] !== undefined);
    // return Object.prototype.hasOwnProperty.call(obj, prop);
}
exports.hasProp = hasProp;
function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    if (req.query && hasProp(req.query, 'token')) {
        return req.query.token;
    }
    return null;
}
exports.getToken = getToken;
//# sourceMappingURL=helper.js.map