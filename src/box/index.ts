const BoxSDK = require('box-node-sdk');
const fs = require('fs');
const path = require('path');
import { boxConfig } from './config';
import type { listFolderItemsParam, listFolderItemsResponse, createFolderResponse, createFileResponse } from './main';

const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
const client = sdk.getAppAuthClient('enterprise');

/** 获取一个问价的列表 -- 分页 */
export async function listFolderItems(payload: listFolderItemsParam): Promise<listFolderItemsResponse> {
    const { folderId, fields, offset, limit, usemarker, marker } = payload
    try {
        return await client.folders.getItems(
            folderId,
            {
                usemarker: usemarker || true,
                marker: marker,
                fields: (Array.isArray(fields) ? fields.join(',') : fields) || 'id,type,name',
                offset: offset,
                limit: limit || 200
            });
    } catch (err: any) {
        throw err;
    }

}
/**获取一个文件夹的信息 */
export async function getBoxFolderInfo(payload: listFolderItemsParam) {
    const { folderId, fields } = payload;
    try {
        return await client.folders.get(folderId, {
            fields: fields || 'id,type,name,modified_at',
        });
    } catch (err: any) {
        throw err;
    }

}
/** 创建新的文件夹 */
export async function createNewFolder(payload: {
    parentFolderId: string;
    folderName: string;
}): Promise<createFolderResponse> {
    const { parentFolderId, folderName } = payload;
    try {
        return await client.folders.create(parentFolderId, folderName);
    } catch (err: any) {
        throw err;
    }
}

/** 锁定一个文件夹 */
export async function lockFolder(folderID: string): Promise<createFolderResponse> {
    try {
        return await client.folders.lock(folderID);
    } catch (err: any) {
        throw err;
    }
}

/** 上传一个文件 */
export async function uploadFile(payload: {
    folderID: string;
    fileName: string;
}): Promise<createFileResponse> {
    const { folderID, fileName } = payload;
    try {
        const stream = fs.createReadStream(path.join(__dirname, '../../tempFiles', fileName));
        return await client.files.uploadFile(folderID, fileName, stream);
    } catch (err: any) {
        throw err;
    }
}
/** 下载一个文件 */
export async function downloadFile(fileId: string, fileName: string): Promise<string> {
    return new Promise((rel, rej) => {
        client.files.getReadStream(fileId, null, function (error: any, stream: any) {
            if (error) {
                throw error
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
}
/**删除一个文件*/
export async function deleteFile(fileId: string): Promise<string> {
    return new Promise((rel, rej) => {
        client.files.delete(fileId, function (error: any, res: any) {
            if (error) {
                throw error
            }
            rel(res);
        })
    });
}

/**  移动文件夹*/
export async function moveFolders(folderID: string, destinationfolderID: string) {
    return new Promise((rel, rej) => {
        client.folders.move(folderID, destinationfolderID).then((folder: any) => {
            rel(folder);
        });
    });
}
