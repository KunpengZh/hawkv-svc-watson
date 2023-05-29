"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.boxFolderConfig = exports.boxConfig = void 0;
exports.boxConfig = {
    "boxAppSettings": {
        "clientID": process.env.boxClientID,
        "clientSecret": process.env.boxClientSecret,
        "appAuth": {
            "publicKeyID": process.env.boxPublicKeyID,
            "privateKey": (_a = process.env.boxPrivateKey) === null || _a === void 0 ? void 0 : _a.replace(/\\n/gi, '\n'),
            "passphrase": process.env.boxPassphrase
        }
    },
    "enterpriseID": process.env.boxEnterprixeID
};
exports.boxFolderConfig = {
    defaultBoxFolderId: '169168943764',
};
