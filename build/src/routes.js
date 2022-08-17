"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("./components/user/user.controller"));
function registerRoutes(app) {
    // new SystemStatusController(app);
    new user_controller_1.default(app);
}
exports.default = registerRoutes;
//# sourceMappingURL=routes.js.map