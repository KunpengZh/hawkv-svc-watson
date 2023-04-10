import { Request, Response, Router } from 'express';
import { queryByDocId, searchDocumentsPage, saveOrUpdateDoc, searchAllDocuments, bulkCreateDocs } from '../services/SharedSvc';
import { USER_GROUP_DOC_ID, userGroup } from '@shared/constants';
import ResponseWarp from '@shared/ResponseWarp';

const sharedRouter = Router();

sharedRouter.post('/searchAllDocuments', async (req: Request, res: Response) => {
    const queryObj: Record<string, string> = req.body;
    res.json(await searchAllDocuments(queryObj, userGroup));
});
sharedRouter.post('/searchDocumentsPage', async (req: Request, res: Response) => {
    const queryObj: Record<string, string> = req.body;
    res.json(await searchDocumentsPage(queryObj, userGroup));
});

sharedRouter.post('/saveOrUpdateDoc', async (req: Request, res: Response) => {
    const doc: Record<string, any> = req.body;
    res.json(await saveOrUpdateDoc(doc));
});

sharedRouter.get('/queryByDocId', async (req: Request, res: Response) => {
    try {
        let userGroupDoc = await queryByDocId(USER_GROUP_DOC_ID);
        const { errorData } = userGroupDoc.data;
        if (errorData && errorData.status === 404) {
            res.json(ResponseWarp.successX({
                doc: {
                    _id: USER_GROUP_DOC_ID,
                    docType: 'userGroup',
                    userGroups: []
                }
            }));
        } else {
            res.json(userGroupDoc);
        }
    } catch (err) {
        res.json(err);
    }
});
sharedRouter.get('/bulkCreateDocs', async (req: Request, res: Response) => {
    const docs: Record<string, any>[] = req.body;
    res.json(await bulkCreateDocs(docs));
});

export default sharedRouter;