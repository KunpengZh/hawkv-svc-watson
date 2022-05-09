"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQuery = exports.adminMW = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const JwtService_1 = require("@shared/JwtService");
const constants_1 = require("@shared/constants");
const { UNAUTHORIZED } = http_status_codes_1.default;
// Middleware to verify if user is an admin
const adminMW = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get json-web-token
        const jwt = req.headers[constants_1.HAWK_TOKEN];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user role is an admin
        yield (0, JwtService_1.decodeJwt)(jwt.toString());
        next();
        // if (clientData.role === UserRoles.Admin) {
        //     res.sessionUser = clientData;
        // } else {
        //     throw Error('JWT not present in signed cookie.');
        // }
    }
    catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
});
exports.adminMW = adminMW;
const checkQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken } = req.query;
        // Get json-web-token
        if (!accessToken) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user role is an admin
        const clientData = yield (0, JwtService_1.decodeJwt)(accessToken.toString());
        next();
    }
    catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: "Your are not authorized to access this page",
        });
    }
});
exports.checkQuery = checkQuery;
