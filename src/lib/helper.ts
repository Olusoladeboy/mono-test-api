/* eslint-disable import/prefer-default-export */
import bcryptjs from 'bcryptjs';

export function hash(str: string = ''): string {
    return bcryptjs.hashSync(str, 5);
}

export function isRealValue(object) {
    return typeof object !== 'undefined' || object !== null;
}

export function hasProp(obj, prop) {
    if (!isRealValue(obj)) return false;
    return (obj[prop] !== undefined);
    // return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } if (req.query && hasProp(req.query, 'token')) {
        return req.query.token;
    }
    return null;
}
