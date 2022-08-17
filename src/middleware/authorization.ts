/* eslint-disable no-use-before-define */
import * as util from 'util';
import * as express from 'express';
import {
  StatusCodes,
} from 'http-status-codes';
import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../abstractions/ApiError';
import UserModel from '../components/user/user.model';
import { UserInterface } from '../components/user/user.types';
import { encrypt } from '../lib/crypto';
import { getToken } from '../lib/helper';
import logger from '../lib/logger';

const jwtdata = {
  jwtSecret: 'MonoTest',
  tokenExpireTime: 70000,
};

interface IUserRequest extends express.Request {
  user: any
}

export const isValidUser = (
  err: ApiError, req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {

  if (err) {
    const status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    logger.debug(`REQUEST HANDLING ERROR:
        \nERROR:\n${JSON.stringify(err)}
        \nREQUEST HEADERS:\n${util.inspect(req.headers)}
        \nREQUEST PARAMS:\n${util.inspect(req.params)}
        \nREQUEST QUERY:\n${util.inspect(req.query)}
        \nBODY:\n${util.inspect(req.body)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any = {
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
      body = encrypt(JSON.stringify(body), environment.secretKey);
    }
    res.status(status).json(body);
  }
  next();
};

export const checkRequestMethod = async (
  req: IUserRequest,
  res: express.Response,
  next: express.NextFunction,
): Promise<void | express.Response<any, Record<string, any>>> => {
  switch (req.method) {
    case 'POST':
      req.body.createdBy = req.user.id;
      break;
    case 'PUT':
      req.body.updatedBy = req.user.id;
      if (req.params.recordId) {
        if (!mongoose.Types.ObjectId.isValid(req.params.recordId)) {
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
        if (!mongoose.Types.ObjectId.isValid(req.params.recordId)) {
          return res.status(400).send('Invalid object id as request parameter');
        }
      }
      break;
    case 'DELETE':
      req.body = {};
      if (req.params.recordId) {
        if (!mongoose.Types.ObjectId.isValid(req.params.recordId)) {
          return res.status(400).send('Invalid object id as request parameter');
        }
      }
      break;
    default:
  }
  return next();
};

export const checkAuth = async (
  req: IUserRequest,
  res: express.Response,
  next: express.NextFunction,
): Promise<void | express.Response<any, Record<string, any>>> => {
  try {
    const token = getToken(req);
    if (!token) throw new Error('No token found');
    const decoded: UserInterface | any = await decodeToken(token);
    if (!decoded) throw new Error('Authorization failed');
    // eslint-disable-next-line no-unused-vars
    const user = await getUser(decoded.id);
    const _user: UserInterface | any = {
      id: decoded.id,
      email: decoded.email,
      token,
    };
    req.user = _user;
    delete req.query.apiKey;
    return checkRequestMethod(req, res, next);
  } catch (err) {
    logger.debug(`REQUEST HANDLING ERROR:
    \nERROR:\n${JSON.stringify(err)}
    \nREQUEST HEADERS:\n${util.inspect(req.headers)}
    \nREQUEST PARAMS:\n${util.inspect(req.params)}
    \nREQUEST QUERY:\n${util.inspect(req.query)}
    \nBODY:\n${util.inspect(req.body)}`);
    return next(err);
  }
};

export const decodeToken = async (token) => new Promise((resolve, reject) => {
  verify(token, jwtdata.jwtSecret, async (err, decoded) => {
    if (err) reject(new Error('Invalid token'));
    resolve(decoded);
  });
});

export async function getUser(id) {
  try {
    const record = await UserModel.findById(id).exec();
    if (!record) throw new Error('User not found');
    return record;
  } catch (err) {
    throw new Error(`${err.message}`);
  }
}

