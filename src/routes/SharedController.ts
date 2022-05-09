import { Request, Response, Router } from 'express';
import { searchDocuments, saveDoc, queryByDocId,generalAppSequence,searchDocumentsPage } from '../services/SharedSvc';

const sharedRouter = Router();

sharedRouter.get('/generalAppSequence', async (req: Request, res: Response) => {
    const dateStr: string = req.query.dateStr as string;
    res.json(await generalAppSequence(dateStr));
});

sharedRouter.post('/searchDocuments', async (req: Request, res: Response) => {
    const queryObj: Record<string, string> = req.body;
    res.json(await searchDocuments(queryObj));
});
sharedRouter.post('/searchDocumentsPage', async (req: Request, res: Response) => {
    const queryObj: Record<string, string> = req.body;
    res.json(await searchDocumentsPage(queryObj));
});

sharedRouter.post('/saveDoc', async (req: Request, res: Response) => {
    const doc: Record<string, any> = req.body;
    res.json(await saveDoc(doc));
});

sharedRouter.get('/queryByDocId', async (req: Request, res: Response) => {
    const docId: string = req.query.docId as string;
    res.json(await queryByDocId(docId));
});

export default sharedRouter;