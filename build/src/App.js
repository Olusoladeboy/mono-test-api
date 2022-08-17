"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const routes_1 = __importDefault(require("./routes"));
class App {
    async init() {
        this.express = (0, express_1.default)();
        this.httpServer = http_1.default.createServer(this.express);
        this.middleware();
        this.routes();
        this.addErrorHandler();
    }
    /**
     * here register your all routes
     */
    routes() {
        this.express.get('/', this.basePathRoute);
        this.express.get('/web', this.parseRequestHeader, this.basePathRoute);
        (0, routes_1.default)(this.express);
    }
    /**
     * here you can apply your middlewares
     */
    middleware() {
        // support application/json type post data
        // support application/x-www-form-urlencoded post data
        // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
        this.express.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
        this.express.use(express_1.default.json({ limit: '100mb' }));
        this.express.use(express_1.default.urlencoded({ limit: '100mb', extended: true }));
        this.express.use((0, cors_1.default)());
    }
    parseRequestHeader(req, res, next) {
        console.log(req.headers.access_token);
        next();
    }
    basePathRoute(request, response) {
        response.json({ message: 'API Base Path' });
    }
    addErrorHandler() {
        this.express.use(error_handler_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map