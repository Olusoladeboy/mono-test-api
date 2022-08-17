"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const environment_constant_1 = require("../../../src/environments/environment.constant");
const crypto_1 = require("../../../src/lib/crypto");
const environment_1 = __importDefault(require("../../../src/environments/environment"));
describe('Crypto Lib (Encryption/Decryption)', () => {
    let instance;
    beforeEach(() => {
        instance = new environment_1.default(environment_constant_1.Environments.TEST);
    });
    it('Testing for text', () => {
        const data = 'This data is to be encrypted';
        const encrypted = (0, crypto_1.encrypt)(data, instance.secretKey);
        const decrypted = (0, crypto_1.decrypt)(encrypted, instance.secretKey);
        expect(decrypted).toEqual(data);
    });
    it('Testing for array', () => {
        const data = ['this', 'is', 'array'];
        const encrypted = (0, crypto_1.encrypt)(JSON.stringify(data), instance.secretKey);
        const decrypted = (0, crypto_1.decrypt)(encrypted, instance.secretKey);
        expect(JSON.parse(decrypted)).toEqual(data);
    });
    it('Testing for object', () => {
        const data = {
            key1: 'value1',
            key2: 'value2',
        };
        const encrypted = (0, crypto_1.encrypt)(JSON.stringify(data), instance.secretKey);
        const decrypted = (0, crypto_1.decrypt)(encrypted, instance.secretKey);
        expect(JSON.parse(decrypted)).toEqual(data);
    });
});
//# sourceMappingURL=crypto.spec.js.map