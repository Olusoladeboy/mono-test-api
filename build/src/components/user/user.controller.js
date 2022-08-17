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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../../lib/helper");
const responsehandler = __importStar(require("../../lib/response-handler"));
const authorization_1 = require("../../middleware/authorization");
const BaseApi_1 = __importDefault(require("../BaseApi"));
const user_model_1 = __importStar(require("./user.model"));
const jwtdata = {
    jwtSecret: 'MonoTest',
    tokenExpireTime: 70000,
};
/**
 * Status controller
 */
class User extends BaseApi_1.default {
    constructor(express) {
        super();
        this.jwtdata = {
            jwtSecret: 'MonoTest',
            tokenExpireTime: 70000,
        };
        this.register(express);
    }
    register(express) {
        express.use('/api/user', this.router);
        this.router.post('/register', this.userSignup);
        this.router.post('/login', this.userLogin);
        this.router.get('/', authorization_1.checkAuth, this.getMyAccount);
        this.router.put('/link-account', authorization_1.checkAuth, this.linkAccount);
        this.router.put('/unlink-account', authorization_1.checkAuth, this.unlinkAccount);
    }
    async userLogin(req, res, next) {
        try {
            const data = req.body;
            const { error } = user_model_1.validateLogin.validate(data);
            if (error)
                throw new Error(error.message);
            const { email, password } = data;
            const user = await user_model_1.default.findOne({ email }).select('+password').exec();
            if (!user)
                throw new Error('User not found');
            if (!bcryptjs_1.default.compareSync(password, `${user.password}`)) {
                throw new Error('Wrong password');
            }
            const payload = {
                id: user._id,
                email: user.email,
                time: new Date(),
            };
            const token = jsonwebtoken_1.default.sign(payload, jwtdata.jwtSecret, {
                expiresIn: jwtdata.tokenExpireTime,
            });
            const result = {
                success: true,
                payload: {
                    user,
                    token
                }
            };
            if (!result)
                throw new Error('Cannot Login');
            res.locals.data = result;
            responsehandler.json(res);
        }
        catch (error) {
            next(error);
        }
    }
    async userSignup(req, res, next) {
        try {
            const data = req.body;
            const { error } = user_model_1.validateRegistration.validate(data);
            if (error)
                throw new Error(error.message);
            if (data.password) {
                data.password = (0, helper_1.hash)(data.password);
            }
            const newRecord = new user_model_1.default(data);
            const result = await newRecord.save();
            if (!result)
                throw new Error('Cannot save data');
            res.locals.data = result;
            responsehandler.send(res);
        }
        catch (error) {
            if (error.message.includes('E11000')) {
                error.message = 'Account Exists';
            }
            next(error);
        }
    }
    async linkAccount(req, res, next) {
        try {
            const data = req.body;
            const { error } = user_model_1.validateLinkAccount.validate(data);
            if (error)
                throw new Error(error.message);
            const { code } = data;
            const result = await user_model_1.default.findByIdAndUpdate(req.user.id, {
                linked_account: true,
                code
            }, { new: true });
            if (!result)
                throw new Error('Error');
            res.locals.data = {
                success: true,
                payload: result
            };
            responsehandler.send(res);
        }
        catch (error) {
            if (error.message.includes('E11000')) {
                error.message = 'Account Exists';
            }
            next(error);
        }
    }
    async unlinkAccount(req, res, next) {
        try {
            // const data: linkaccountInteface = req.body;
            // const { error } = validateLinkAccount.validate(data);
            // if (error) throw new Error(error.message);
            const result = await user_model_1.default.findByIdAndUpdate(req.user.id, {
                linked_account: false,
                // code: null
            }, { new: true });
            if (!result)
                throw new Error('Error');
            res.locals.data = {
                success: true,
                payload: result
            };
            responsehandler.send(res);
        }
        catch (error) {
            if (error.message.includes('E11000')) {
                error.message = 'Account Exists';
            }
            next(error);
        }
    }
    async getMyAccount(req, res, next) {
        var _a;
        try {
            const result = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!result)
                throw new Error('User not found');
            res.locals.data = result;
            responsehandler.send(res);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = User;
//# sourceMappingURL=user.controller.js.map