"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.getJwt = void 0;
/* eslint-disable @typescript-eslint/ban-types */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("@shared/constants");
const secret = (constants_1.JWT_SECRET || constants_1.WITHOUR_SECRET);
const jwtOptions = {
    expiresIn: (constants_1.COOKIE_EXP === null || constants_1.COOKIE_EXP === void 0 ? void 0 : constants_1.COOKIE_EXP.toString()) || String(24 * 60 * 60 * 1000),
    algorithm: 'HS256'
};
const VALIDATION_ERROR = 'JSON-web-token validation failed.';
function getJwt(data) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(data, secret, jwtOptions, (err, token) => {
            err ? reject(err) : resolve(token || '');
        });
    });
}
exports.getJwt = getJwt;
function decodeJwt(jwt) {
    return new Promise((res, rej) => {
        jsonwebtoken_1.default.verify(jwt, secret, (err, decoded) => {
            return err ? rej(VALIDATION_ERROR) : res(decoded);
        });
    });
}
exports.decodeJwt = decodeJwt;
