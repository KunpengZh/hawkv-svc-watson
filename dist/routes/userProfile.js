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
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const express_1 = require("express");
const userProfile_1 = require("../services/userProfile");
const nodeRouter = (0, express_1.Router)();
nodeRouter.post('/loadUserProfileList', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit, bookmark, current = 0, direction = 'next', userRole, emailAddress } = req.body;
        res.json(yield (0, userProfile_1.loadUserProfileList)({ limit, bookmark, current, direction, userRole, emailAddress }));
    });
});
nodeRouter.get('/loadAllUserProfiles', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json(yield (0, userProfile_1.loadAllUserProfiles)());
    });
});
nodeRouter.post('/createUserProfile', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userProfile } = req.body;
        if (!userProfile || userProfile._id) {
            res.json(ResponseWarp_1.default.err(100, 'userProfile format incorrect'));
            return;
        }
        res.json(yield (0, userProfile_1.createUserProfile)(userProfile));
    });
});
nodeRouter.post('/updateUserProfile', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userProfile } = req.body;
        if (!userProfile || !userProfile._id) {
            res.json(ResponseWarp_1.default.err(100, 'userProfile format incorrect'));
            return;
        }
        res.json(yield (0, userProfile_1.updateUserProfile)(userProfile));
    });
});
nodeRouter.post('/bulkCreateUserProfiles', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userProfiles } = req.body;
        res.json(yield (0, userProfile_1.bulkCreateUserProfiles)(userProfiles));
    });
});
exports.default = nodeRouter;
