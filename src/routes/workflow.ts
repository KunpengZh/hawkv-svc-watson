import { Request, Response, Router } from 'express';
import { submitDoc,completeDoc } from '../services/workflow';
import type { IFormDocument } from '@services/main';

const sharedRouter = Router();

sharedRouter.post('/submitDoc', async function (req: Request, res: Response) {
    const formDoc: IFormDocument = req.body;
    res.json(await submitDoc(formDoc));
});
sharedRouter.post('/completeDoc', async function (req: Request, res: Response) {
    const formDoc: IFormDocument = req.body;
    res.json(await completeDoc(formDoc));
});
export default sharedRouter;