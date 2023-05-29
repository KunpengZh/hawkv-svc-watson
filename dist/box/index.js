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
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFolders = exports.deleteFile = exports.downloadFile = exports.uploadFile = exports.lockFolder = exports.createNewFolder = exports.getBoxFolderInfo = exports.listFolderItems = void 0;
const BoxSDK = require('box-node-sdk');
const fs = require('fs');
const path = require('path');
const config_1 = require("./config");
const sdk = BoxSDK.getPreconfiguredInstance(config_1.boxConfig);
const client = sdk.getAppAuthClient('enterprise');
/** 获取一个问价的列表 -- 分页 */
function listFolderItems(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { folderId, fields, offset, limit, usemarker, marker } = payload;
        try {
            return yield client.folders.getItems(folderId, {
                usemarker: usemarker || true,
                marker: marker,
                fields: (Array.isArray(fields) ? fields.join(',') : fields) || 'id,type,name',
                offset: offset,
                limit: limit || 200
            });
        }
        catch (err) {
            throw err;
        }
    });
}
exports.listFolderItems = listFolderItems;
/**获取一个文件夹的信息 */
function getBoxFolderInfo(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { folderId, fields } = payload;
        try {
            return yield client.folders.get(folderId, {
                fields: fields || 'id,type,name,modified_at',
            });
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getBoxFolderInfo = getBoxFolderInfo;
/** 创建新的文件夹 */
function createNewFolder(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parentFolderId, folderName } = payload;
        try {
            return yield client.folders.create(parentFolderId, folderName);
        }
        catch (err) {
            throw err;
        }
    });
}
exports.createNewFolder = createNewFolder;
/** 锁定一个文件夹 */
function lockFolder(folderID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield client.folders.lock(folderID);
        }
        catch (err) {
            throw err;
        }
    });
}
exports.lockFolder = lockFolder;
/** 上传一个文件 */
function uploadFile(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { folderID, fileName } = payload;
        try {
            const stream = fs.createReadStream(path.join(__dirname, '../../tempFiles', fileName));
            return yield client.files.uploadFile(folderID, fileName, stream);
        }
        catch (err) {
            throw err;
        }
    });
}
exports.uploadFile = uploadFile;
/** 下载一个文件 */
function downloadFile(fileId, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((rel, rej) => {
            client.files.getReadStream(fileId, null, function (error, stream) {
                if (error) {
                    throw error;
                }
                // write the file to disk
                const targetFileName = path.join(__dirname, '../../tempFiles', fileName);
                var output = fs.createWriteStream(targetFileName);
                stream.pipe(output);
                stream.on('close', () => {
                    setTimeout(() => {
                        rel(targetFileName);
                    }, 200);
                });
            });
        });
    });
}
exports.downloadFile = downloadFile;
/**删除一个文件*/
function deleteFile(fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((rel, rej) => {
            client.files.delete(fileId, function (error, res) {
                if (error) {
                    throw error;
                }
                rel(res);
            });
        });
    });
}
exports.deleteFile = deleteFile;
/**  移动文件夹*/
function moveFolders(folderID, destinationfolderID) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((rel, rej) => {
            client.folders.move(folderID, destinationfolderID).then((folder) => {
                rel(folder);
            });
        });
    });
}
exports.moveFolders = moveFolders;
