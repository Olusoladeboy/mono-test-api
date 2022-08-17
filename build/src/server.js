"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const App_1 = __importDefault(require("./App"));
const environment_1 = __importDefault(require("./environments/environment"));
const global_1 = require("./global");
const logger_1 = __importDefault(require("./lib/logger"));
const env = new environment_1.default();
(0, global_1.setGlobalEnvironment)(env);
const app = new App_1.default();
let server;
function serverError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific error codes here.
    throw error;
}
console.log(env.mongoUri);
mongoose_1.default.Promise = global.Promise;
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose_1.default.connect(env.mongoUri, mongooseOptions).then(() => {
    console.log('connected to database');
}).catch(error => {
    throw new Error(error);
});
function serverListening() {
    const addressInfo = server.address();
    logger_1.default.info(`Listening on ${addressInfo.address}:${env.port}`);
}
app.init().then(() => {
    app.express.set('port', env.port);
    server = app.httpServer; // http.createServer(App);
    server.on('error', serverError);
    server.on('listening', serverListening);
    server.listen(env.port);
}).catch((err) => {
    logger_1.default.info('app.init error');
    logger_1.default.error(err.name);
    logger_1.default.error(err.message);
    logger_1.default.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('Unhandled Promise Rejection: reason:', reason.message);
    logger_1.default.error(reason.stack);
    // application specific logging, throwing an error, or other logic here
});
//# sourceMappingURL=server.js.map