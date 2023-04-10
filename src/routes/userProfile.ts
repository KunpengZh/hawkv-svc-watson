import { Request, Response, Router } from 'express';
import { queryByDocId, searchDocumentsPage, saveOrUpdateDoc, searchAllDocuments, bulkCreateDocs } from '../services/SharedSvc';
import { userProfile } from '@shared/constants';

const sharedRouter = Router();

sharedRouter.post('/searchAllDocuments', async (req: Request, res: Response) => {
    const queryObj: Record<string, string> = req.body;
    res.json(await searchAllDocuments(queryObj,userProfile));
});
sharedRouter.post('/searchDocumentsPage', async (req: Request, res: Response) => {
    const queryObj: Record<string, string> = req.body;
    res.json(await searchDocumentsPage(queryObj,userProfile));
});

sharedRouter.post('/saveOrUpdateDoc', async (req: Request, res: Response) => {
    const doc: Record<string, any> = req.body;
    res.json(await saveOrUpdateDoc(doc));
});

sharedRouter.get('/queryByDocId', async (req: Request, res: Response) => {
    const docId: string = req.query.docId as string;
    res.json(await queryByDocId(docId));
});
sharedRouter.get('/bulkCreateDocs', async (req: Request, res: Response) => {
    const docs: Record<string, any>[] = req.body;
    res.json(await bulkCreateDocs(docs));
});

export default sharedRouter;