"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const supertest_1 = __importDefault(require("supertest"));
const http_status_codes_1 = require("http-status-codes");
const Integration_helpers_1 = __importDefault(require("../helpers/Integration-helpers"));
describe('status integration tests', () => {
    let app;
    beforeAll(async () => {
        app = await Integration_helpers_1.default.getApp();
    });
    it('can get server time', async () => {
        await (0, supertest_1.default)(app)
            .get('/api/status/time')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
            // eslint-disable-next-line no-console
            console.log(res.text);
        })
            .expect(http_status_codes_1.StatusCodes.OK);
    });
    it('can get server system info', async () => {
        await (0, supertest_1.default)(app)
            .get('/api/status/system')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(http_status_codes_1.StatusCodes.OK);
    });
    it('can get server system usage', async () => {
        await (0, supertest_1.default)(app)
            .get('/api/status/usage')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(http_status_codes_1.StatusCodes.OK);
    });
    it('can get server system process info', async () => {
        await (0, supertest_1.default)(app)
            .get('/api/status/process')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(http_status_codes_1.StatusCodes.OK);
    });
    it('should get the error', async () => {
        await (0, supertest_1.default)(app)
            .get('/api/status/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(http_status_codes_1.StatusCodes.BAD_REQUEST);
    });
});
//# sourceMappingURL=status.integration.spec.js.map