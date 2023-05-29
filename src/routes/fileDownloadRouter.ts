import ResponseWarp from '../shared/ResponseWarp';
import { Request, Response, Router } from 'express';
const fs = require('fs');
import {
    downloadFile,
} from '../box';

const fileUploader = Router();

/** 下载图片 */
fileUploader.get('/downloadImage', async function (req: Request, res: Response) {
    let { fileId, fileName } = req.query;
    fileId = fileId?.toString();
    fileName = fileName?.toString();
    if (!fileId || !fileName) {
        return res.json(ResponseWarp.err(400, 'fileId and fileName is mandatory required'));
    }
    try {
        downloadFile(fileId, fileName).then((targerFileName: string) => {
            res.status(200);
            res.set({
                "Content-type": "image/jpeg;charset=UTF-8",
                "Content-Disposition": "inline; filename=" + encodeURI(fileName?.toString() || '')
            });
            //response.setHeader("Content-Disposition", 'inline; filename="' + fileName + '"');
            // res.write(body);
            // response.end();
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

export default fileUploader;