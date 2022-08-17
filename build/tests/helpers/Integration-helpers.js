"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("../../src/App"));
const logger_1 = __importDefault(require("../../src/lib/logger"));
const global_1 = require("../../src/global");
const environment_1 = __importDefault(require("../../src/environments/environment"));
const environment_constant_1 = require("../../src/environments/environment.constant");
class IntegrationHelpers {
    static async getApp() {
        if (this.appInstance) {
            return this.appInstance;
        }
        const env = new environment_1.default(environment_constant_1.Environments.TEST);
        (0, global_1.setGlobalEnvironment)(env);
        const app = new App_1.default();
        await app.init();
        this.appInstance = app.express;
        return this.appInstance;
    }
    clearDatabase() {
        logger_1.default.info('clear the database');
    }
}
exports.default = IntegrationHelpers;
//# sourceMappingURL=Integration-helpers.js.map