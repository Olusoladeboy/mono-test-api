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
const os = __importStar(require("os"));
const process = __importStar(require("process"));
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../abstractions/ApiError"));
const responsehandler = __importStar(require("../../lib/response-handler"));
const BaseApi_1 = __importDefault(require("../BaseApi"));
/**
 * Status controller
 */
class SystemStatusController extends BaseApi_1.default {
    constructor(express) {
        super();
        this.register(express);
    }
    register(express) {
        express.use('/api/status', this.router);
        this.router.get('/system', this.getSystemInfo);
        this.router.get('/time', this.getServerTime);
        this.router.get('/usage', this.getResourceUsage);
        this.router.get('/process', this.getProcessInfo);
        this.router.get('/error', this.getError);
    }
    getSystemInfo(req, res, next) {
        try {
            const response = {
                cpus: os.cpus(),
                network: os.networkInterfaces(),
                os: {
                    platform: process.platform,
                    version: os.release(),
                    totalMemory: os.totalmem(),
                    uptime: os.uptime(),
                },
                currentUser: os.userInfo(),
            };
            res.locals.data = response;
            responsehandler.send(res);
        }
        catch (err) {
            next(err);
        }
    }
    getError(req, res, next) {
        try {
            throw new ApiError_1.default(http_status_codes_1.ReasonPhrases.BAD_REQUEST, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        catch (error) {
            next(error);
        }
    }
    getServerTime(req, res, next) {
        try {
            const now = new Date();
            const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            const time = {
                utc,
                date: now,
            };
            res.locals.data = time;
            responsehandler.send(res);
        }
        catch (error) {
            next(error);
        }
    }
    getResourceUsage(req, res, next) {
        try {
            const totalMem = os.totalmem();
            const memProc = process.memoryUsage();
            const freemMem = os.freemem();
            const response = {
                processMemory: memProc,
                systemMemory: {
                    free: freemMem,
                    total: totalMem,
                    percentFree: Math.round((freemMem / totalMem) * 100),
                },
                processCpu: process.cpuUsage(),
                systemCpu: os.cpus(),
            };
            res.locals.data = response;
            responsehandler.send(res);
        }
        catch (err) {
            next(err);
        }
    }
    getProcessInfo(req, res, next) {
        try {
            const response = {
                procCpu: process.cpuUsage(),
                memUsage: process.memoryUsage(),
                env: process.env,
                pid: process.pid,
                uptime: process.uptime(),
                applicationVersion: process.version,
                nodeDependencyVersions: process.versions,
            };
            res.locals.data = response;
            responsehandler.send(res);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = SystemStatusController;
//# sourceMappingURL=system-status.controller.js.map