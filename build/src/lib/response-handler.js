"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = exports.send = void 0;
const http_status_codes_1 = require("http-status-codes");
const crypto_1 = require("./crypto");
const logger_1 = __importDefault(require("./logger"));
function send(res) {
    let obj = {};
    obj = res.locals.data;
    if (environment.isProductionEnvironment()) {
        logger_1.default.info(JSON.stringify(obj, null, 2));
    }
    if (environment.applyEncryption) {
        obj = (0, crypto_1.encrypt)(JSON.stringify(obj), environment.secretKey);
    }
    res.status(http_status_codes_1.StatusCodes.OK).send(obj);
}
exports.send = send;
function json(res) {
    let obj = {};
    obj = res.locals.data;
    if (environment.isProductionEnvironment()) {
        logger_1.default.info(JSON.stringify(obj, null, 2));
    }
    if (environment.applyEncryption) {
        obj = (0, crypto_1.encrypt)(JSON.stringify(obj), environment.secretKey);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(obj);
}
exports.json = json;
//# sourceMappingURL=response-handler.js.map