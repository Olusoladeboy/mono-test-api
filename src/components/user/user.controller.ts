import aqp from 'api-query-params';
import bcryptjs from 'bcryptjs';
import { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { hash } from '../../lib/helper';
import * as responsehandler from '../../lib/response-handler';
import { checkAuth } from '../../middleware/authorization';
import BaseApi from '../BaseApi';
import UserModel, { UserDoc, validateLinkAccount, validateLogin, validateRegistration } from './user.model';
import { IUserRequest, linkaccountInteface, UserInterface } from './user.types';

const jwtdata = {
    jwtSecret: 'MonoTest',
    tokenExpireTime: 70000,
};
/**
 * Status controller
 */
export default class User extends BaseApi {
    jwtdata = {
        jwtSecret: 'MonoTest',
        tokenExpireTime: 70000,
    };

    constructor(express: Application) {
        super();
        this.register(express);
    }

    public register(express: Application): void {
        express.use('/api/user', this.router);
        this.router.post('/register', this.userSignup);
        this.router.post('/login', this.userLogin);
        this.router.get('/', checkAuth, this.getMyAccount);
        this.router.put('/link-account', checkAuth, this.linkAccount);
        this.router.put('/unlink-account', checkAuth, this.unlinkAccount);
    }

    public async userLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UserInterface = req.body;
            const { error } = validateLogin.validate(data);
            if (error) throw new Error(error.message);
            const { email, password } = data;
            const user: UserDoc = await UserModel.findOne({ email }).select('+password').exec();
            if (!user) throw new Error('User not found');
            if (!bcryptjs.compareSync(password, `${user.password}`)) {
                throw new Error('Wrong password');
            }
            const payload = {
                id: user._id,
                email: user.email,
                time: new Date(),
            };
            const token = jwt.sign(payload, jwtdata.jwtSecret, {
                expiresIn: jwtdata.tokenExpireTime,
            });
            const result = {
                success: true,
                payload: {
                    user,
                    token
                }
            };
            if (!result) throw new Error('Cannot Login');
            res.locals.data = result;
            responsehandler.json(res);
        } catch (error) {
            next(error);
        }
    }

    public async userSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UserInterface = req.body;
            const { error } = validateRegistration.validate(data);
            if (error) throw new Error(error.message);
            if (data.password) {
                data.password = hash(data.password);
            }
            const newRecord = new UserModel(data);
            const result = await newRecord.save();
            if (!result) throw new Error('Cannot save data');
            res.locals.data = result;
            responsehandler.send(res);
        } catch (error) {
            if (error.message.includes('E11000')) {
                error.message = 'Account Exists';
            }
            next(error);
        }
    }

    public async linkAccount(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: linkaccountInteface = req.body;
            const { error } = validateLinkAccount.validate(data);
            if (error) throw new Error(error.message);
            const { code } = data;
            const result = await UserModel.findByIdAndUpdate(req.user.id,
                {
                    linked_account: true,
                    code
                },
                { new: true }
            );
            if (!result) throw new Error('Error');
            res.locals.data = {
                success: true,
                payload: result
            };
            responsehandler.send(res);
        } catch (error) {
            if (error.message.includes('E11000')) {
                error.message = 'Account Exists';
            }
            next(error);
        }
    }

    public async unlinkAccount(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // const data: linkaccountInteface = req.body;
            // const { error } = validateLinkAccount.validate(data);
            // if (error) throw new Error(error.message);
            const result = await UserModel.findByIdAndUpdate(req.user.id,
                {
                    linked_account: false,
                    // code: null
                },
                { new: true }
            );
            if (!result) throw new Error('Error');
            res.locals.data = {
                success: true,
                payload: result
            };
            responsehandler.send(res);
        } catch (error) {
            if (error.message.includes('E11000')) {
                error.message = 'Account Exists';
            }
            next(error);
        }
    }

    public async getMyAccount(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await UserModel.findById(req.user?.id);
            if (!result) throw new Error('User not found');
            res.locals.data = result;
            responsehandler.send(res);
        } catch (error) {
            next(error);
        }
    }

}
