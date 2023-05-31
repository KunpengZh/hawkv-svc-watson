import { Request, Response, Router } from 'express';
import ResponseWarp from '../shared/ResponseWarp';
const fs = require('fs');
import path from 'path';
import {
    uploadFile,
    downloadFile,
    createNewFolder,
    listFolderItems,
    deleteFile
} from '../box';
import { boxFolderConfig } from '../box/config';
import type { listFolderItemsResponse } from 'src/box/main';

const fileUploader = Router();

/** 上传一个文件到box */
fileUploader.post('/uploadFileToBox', async function (req: Request, res: Response) {
    const reqBody: any = req.body || {};
    const { boxFolderName, lastFileKey } = reqBody;
    let { boxFolderId } = reqBody;
    if (boxFolderId === 'undefined') {
        boxFolderId = undefined;
    }

    if (!boxFolderId && !boxFolderName) {
        return res.json(ResponseWarp.err(400, 'You must provide either boxFolderId or boxFolderName'));
    }

    if (!req.files || Object.keys(req.files).length !== 1) {
        return res.json(ResponseWarp.err(400, 'files is empty or more then 1 file uploaded'));
    }
    try {
        if (!boxFolderId) {
            const { defaultBoxFolderId } = boxFolderConfig;
            /** 首先检查文件夹是否存在, 如果存在直接用文件夹名,如果不存在,创建新的文件夹 */
            let maker: string | undefined = undefined;
            do {
                const folderItemsRes: listFolderItemsResponse = await listFolderItems({
                    folderId: defaultBoxFolderId,
                    marker: maker,
                });
                const { entries = [], next_marker } = folderItemsRes;
                maker = next_marker;
                entries.forEach((entriy: any) => {
                    if (entriy.name === boxFolderName) {
                        boxFolderId = entriy.id;
                        maker = undefined;
                    }
                });
            } while (maker);

            if (!boxFolderId) {
                /** 以 reqPartNumbers 为名,创建新的folder */
                const createFolderRes = await createNewFolder({
                    parentFolderId: defaultBoxFolderId,
                    folderName: boxFolderName
                });
                const { id } = createFolderRes;
                boxFolderId = id;
            }
        }
        for (let key of Object.keys(req.files)) {
            const uploadFileObj: any = req.files[key];
            const targetFileName = `${path.join(__dirname, '../..', 'tempFiles')}/${uploadFileObj.name}`;
            uploadFileObj.mv(targetFileName);
            setTimeout(async () => {
                try {
                    const createRes:any = await uploadFile({
                        folderID: boxFolderId,
                        fileName: uploadFileObj.name
                    });
                    // 将上一个文件的版本附带回前端
                    createRes.lastFileKey = lastFileKey;
                    fs.unlink(targetFileName, (err: any) => {
                        if (err) {
                            res.json(ResponseWarp.successX(createRes, JSON.stringify(err)));
                        }
                    });
                    res.json(ResponseWarp.successX(createRes));
                } catch (error: any) {
                    res.json(ResponseWarp.err(100, JSON.stringify(error)));
                }
            }, 1000);
        }
    } catch (error: any) {
        res.json(ResponseWarp.err(100, JSON.stringify(error)));
    }
});
/**从box中下载一个文件 */
fileUploader.get('/downloadFileFromBox', async function (req: Request, res: Response) {
    let { fileId, fileName } = req.query;
    fileId = fileId?.toString();
    fileName = fileName?.toString();
    if (!fileId || !fileName) {
        return res.json(ResponseWarp.err(400, 'fileId and fileName is mandatory required'));
    }
    try {
        downloadFile(fileId, fileName).then((targerFileName: string) => {
            res.download(targerFileName);
            setTimeout(() => {
                fs.unlink(targerFileName, (err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }, 10000);
        });
    } catch (error: any) {
        res.json(ResponseWarp.err(100, JSON.stringify(error)));
    }
});

/** 从box中删除一个文件 */
fileUploader.get('/deleteFileFromBox', async function (req: Request, res: Response) {
    let { fileId } = req.query;
    fileId = fileId?.toString();
    if (!fileId) {
        return res.json(ResponseWarp.err(400, 'fileId is mandatory required'));
    }
    try {
        deleteFile(fileId).then((delRes: any) => {
            res.json(ResponseWarp.successX(delRes));
        });
    } catch (error: any) {
        res.json(ResponseWarp.err(100, JSON.stringify(error)));
    }
});

export default fileUploader;