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
const express_1 = require("express");
const ResponseWarp_1 = __importDefault(require("../shared/ResponseWarp"));
const fs = require('fs');
const path_1 = __importDefault(require("path"));
const box_1 = require("../box");
const config_1 = require("../box/config");
const fileUploader = (0, express_1.Router)();
/** 上传一个文件到box */
fileUploader.post('/uploadFileToBox', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqBody = req.body || {};
        const { boxFolderName, lastFileKey } = reqBody;
        let { boxFolderId } = reqBody;
        if (boxFolderId === 'undefined') {
            boxFolderId = undefined;
        }
        if (!boxFolderId && !boxFolderName) {
            return res.json(ResponseWarp_1.default.err(400, 'You must provide either boxFolderId or boxFolderName'));
        }
        if (!req.files || Object.keys(req.files).length !== 1) {
            return res.json(ResponseWarp_1.default.err(400, 'files is empty or more then 1 file uploaded'));
        }
        try {
            if (!boxFolderId) {
                const { defaultBoxFolderId } = config_1.boxFolderConfig;
                /** 首先检查文件夹是否存在, 如果存在直接用文件夹名,如果不存在,创建新的文件夹 */
                let maker = undefined;
                do {
                    const folderItemsRes = yield (0, box_1.listFolderItems)({
                        folderId: defaultBoxFolderId,
                        marker: maker,
                    });
                    const { entries = [], next_marker } = folderItemsRes;
                    maker = next_marker;
                    entries.forEach((entriy) => {
                        if (entriy.name === boxFolderName) {
                            boxFolderId = entriy.id;
                            maker = undefined;
                        }
                    });
                } while (maker);
                if (!boxFolderId) {
                    /** 以 reqPartNumbers 为名,创建新的folder */
                    const createFolderRes = yield (0, box_1.createNewFolder)({
                        parentFolderId: defaultBoxFolderId,
                        folderName: boxFolderName
                    });
                    const { id } = createFolderRes;
                    boxFolderId = id;
                }
            }
            for (let key of Object.keys(req.files)) {
                const uploadFileObj = req.files[key];
                const targetFileName = `${path_1.default.join(__dirname, '../..', 'tempFiles')}/${uploadFileObj.name}`;
                uploadFileObj.mv(targetFileName);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const createRes = yield (0, box_1.uploadFile)({
                            folderID: boxFolderId,
                            fileName: uploadFileObj.name
                        });
                        // 将上一个文件的版本附带回前端
                        createRes.lastFileKey = lastFileKey;
                        fs.unlink(targetFileName, (err) => {
                            if (err) {
                                res.json(ResponseWarp_1.default.successX(createRes, JSON.stringify(err)));
                            }
                        });
                        res.json(ResponseWarp_1.default.successX(createRes));
                    }
                    catch (error) {
                        res.json(ResponseWarp_1.default.err(100, JSON.stringify(error)));
                    }
                }), 1000);
            }
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
/** 从box中删除一个文件 */
fileUploader.get('/deleteFileFromBox', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fileId } = req.query;
        fileId = fileId === null || fileId === void 0 ? void 0 : fileId.toString();
        if (!fileId) {
            return res.json(ResponseWarp_1.default.err(400, 'fileId is mandatory required'));
        }
        try {
            (0, box_1.deleteFile)(fileId).then((delRes) => {
                res.json(ResponseWarp_1.default.successX(delRes));
            });
        }
        catch (error) {
            res.json(ResponseWarp_1.default.err(100, JSON.stringify(error)));
        }
    });
});
exports.default = fileUploader;
