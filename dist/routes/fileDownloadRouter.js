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
const ResponseWarp_1 = __importDefault(require("../shared/ResponseWarp"));
const express_1 = require("express");
const fs = require('fs');
const box_1 = require("../box");
const fileUploader = (0, express_1.Router)();
/** 下载图片 */
fileUploader.get('/downloadImage', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileId, fileName } = req.query;
        fileId = fileId === null || fileId === void 0 ? void 0 : fileId.toString();
        fileName = fileName === null || fileName === void 0 ? void 0 : fileName.toString();
        if (!fileId || !fileName) {
            return res.json(ResponseWarp_1.default.err(400, 'fileId and fileName is mandatory required'));
        }
        try {
            (0, box_1.downloadFile)(fileId, fileName).then((targerFileName) => {
                res.status(200);
                res.set({
                    "Content-type": "image/jpeg;charset=UTF-8",
                    "Content-Disposition": "inline; filename=" + encodeURI((fileName === null || fileName === void 0 ? void 0 : fileName.toString()) || '')
                });
                //response.setHeader("Content-Disposition", 'inline; filename="' + fileName + '"');
                // res.write(body);
                // response.end();
                res.download(targerFileName);
                setTimeout(() => {
                    fs.unlink(targerFileName, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }, 10000);
            });
        }
        catch (error) {
            res.json(ResponseWarp_1.default.err(100, JSON.stringify(error)));
        }
    });
});
/**从box中下载一个文件 */
fileUploader.get('/downloadFileFromBox', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileId, fileName } = req.query;
        fileId = fileId === null || fileId === void 0 ? void 0 : fileId.toString();
        fileName = fileName === null || fileName === void 0 ? void 0 : fileName.toString();
        if (!fileId || !fileName) {
            return res.json(ResponseWarp_1.default.err(400, 'fileId and fileName is mandatory required'));
        }
        try {
            (0, box_1.downloadFile)(fileId, fileName).then((targerFileName) => {
                res.download(targerFileName);
                setTimeout(() => {
                    fs.unlink(targerFileName, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }, 10000);
            });
        }
        catch (error) {
            res.json(ResponseWarp_1.default.err(100, JSON.stringify(error)));
        }
    });
});
exports.default = fileUploader;
