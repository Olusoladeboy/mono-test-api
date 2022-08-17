"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const environment_1 = __importDefault(require("../../../src/environments/environment"));
const environment_constant_1 = require("../../../src/environments/environment.constant");
describe('Environment', () => {
    let instance;
    beforeEach(() => {
        instance = new environment_1.default('local');
    });
    it('should get the current environment', async () => {
        expect(instance).toBeInstanceOf(environment_1.default);
        const environment = instance.getCurrentEnvironment();
        expect(environment).toBeDefined();
        expect(environment).toBe(environment_constant_1.Environments.LOCAL);
    });
    it('should check if environement is production or not', async () => {
        const result = instance.isProductionEnvironment();
        expect(result).toBe(false);
    });
    it('should set the current environment', async () => {
        instance.setEnvironment('local');
        const environment = instance.getCurrentEnvironment();
        expect(environment).toBeDefined();
        expect(environment).toBe(environment_constant_1.Environments.LOCAL);
    });
});
//# sourceMappingURL=environment.sepc.js.map