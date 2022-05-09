"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ResponseWarp_1 = __importDefault(require("@shared/ResponseWarp"));
const testRouter = (0, express_1.Router)();
testRouter.get("/verify", function (req, res) {
    res.json(ResponseWarp_1.default.success("msg", "Authorication Verification successfully"));
});
exports.default = testRouter;
