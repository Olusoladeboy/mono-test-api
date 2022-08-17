"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.decodeToken = exports.checkAuth = exports.checkRequestMethod = exports.isValidUser = void 0;
/* eslint-disable no-use-before-define */
const util = __importStar(require("util"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = require("jsonwebtoken");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../components/user/user.model"));
const crypto_1 = require("../lib/crypto");
const helper_1 = require("../lib/helper");
const logger_1 = __importDefault(require("../lib/logger"));
const jwtdata = {
    jwtSecret: 'MonoTest',
    tokenExpireTime: 70000,
};
const isValidUser = (err, req, res, next) => {
    if (err) {
        const status = err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
        logger_1.default.debug(`REQUEST HANDLING ERROR:
        \nERROR:\n${JSON.stringify(err)}
        \nREQUEST HEADERS:\n${util.inspect(req.headers)}
        \nREQUEST PARAMS:\n${util.inspect(req.params)}
        \nREQUEST QUERY:\n${util.inspect(req.query)}
        \nBODY:\n${util.inspect(req.body)}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let body = {
            fields: err.fields,
            message: err.message || 'An error occurred during the request.',
            name: err.name,
            status,
            stack: '',
        };
        // If the environment is production then no need to send error stack trace
        if (environment.isDevEnvironment()) {
            body.stack = err.stack;
        }
        if (environment.applyEncryption) {
            body = (0, crypto_1.encrypt)(JSON.stringify(body), environment.secretKey);
        }
        res.status(status).json(body);
    }
    next();
};
exports.isValidUser = isValidUser;
const checkRequestMethod = async (req, res, next) => {
    switch (req.method) {
        case 'POST':
            req.body.createdBy = req.user.id;
            break;
        case 'PUT':
            req.body.updatedBy = req.user.id;
            if (req.params.recordId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(req.params.recordId)) {
                    return res.status(400).send('Invalid object id as request parameter');
                }
            }
            break;
        case 'PATCH':
            if (req.body.deleted === true || req.body.deleted === 'true') {
                req.body = {};
                req.body.deleted = true;
                req.body.deletedAt = Date.now();
                req.body.deletedBy = req.user.id;
            }
            if (req.params.recordId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(req.params.recordId)) {
                    return res.status(400).send('Invalid object id as request parameter');
                }
            }
            break;
        case 'DELETE':
            req.body = {};
            if (req.params.recordId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(req.params.recordId)) {
                    return res.status(400).send('Invalid object id as request parameter');
                }
            }
            break;
        default:
    }
    return next();
};
exports.checkRequestMethod = checkRequestMethod;
const checkAuth = async (req, res, next) => {
    try {
        const token = (0, helper_1.getToken)(req);
        if (!token)
            throw new Error('No token found');
        const decoded = await (0, exports.decodeToken)(token);
        if (!decoded)
            throw new Error('Authorization failed');
        // eslint-disable-next-line no-unused-vars
        const user = await getUser(decoded.id);
        const _user = {
            id: decoded.id,
            email: decoded.email,
            token,
        };
        req.user = _user;
        delete req.query.apiKey;
        return (0, exports.checkRequestMethod)(req, res, next);
    }
    catch (err) {
        logger_1.default.debug(`REQUEST HANDLING ERROR:
    \nERROR:\n${JSON.stringify(err)}
    \nREQUEST HEADERS:\n${util.inspect(req.headers)}
    \nREQUEST PARAMS:\n${util.inspect(req.params)}
    \nREQUEST QUERY:\n${util.inspect(req.query)}
    \nBODY:\n${util.inspect(req.body)}`);
        return next(err);
    }
};
exports.checkAuth = checkAuth;
const decodeToken = async (token) => new Promise((resolve, reject) => {
    (0, jsonwebtoken_1.verify)(token, jwtdata.jwtSecret, async (err, decoded) => {
        if (err)
            reject(new Error('Invalid token'));
        resolve(decoded);
    });
});
exports.decodeToken = decodeToken;
async function getUser(id) {
    try {
        const record = await user_model_1.default.findById(id).exec();
        if (!record)
            throw new Error('User not found');
        return record;
    }
    catch (err) {
        throw new Error(`${err.message}`);
    }
}
exports.getUser = getUser;
//# sourceMappingURL=authorization.js.map