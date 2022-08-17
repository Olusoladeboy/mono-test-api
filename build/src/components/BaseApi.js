"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/**
 * Provides services common to all API methods
 */
class BaseApi {
    constructor() {
        this.router = (0, express_1.Router)();
    }
}
exports.default = BaseApi;
//# sourceMappingURL=BaseApi.js.map