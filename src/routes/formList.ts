import { loadFormDocList, sendNotificationAndSave } from '@services/formList';
import { IFormDocument, INotification } from '@services/main';
import { Request, Response, Router } from 'express';


const sharedRouter = Router();

sharedRouter.post('/loadFormDocList', async (req: Request, res: Response) => {
    const queryObj = req.body;
    res.json(await loadFormDocList(queryObj));
});
sharedRouter.post('/sendNotificationAndSave', async (req: Request, res: Response) => {
    const params: { formDocument: IFormDocument; notification: INotification } = req.body;
    res.json(await sendNotificationAndSave(params));
});

export default sharedRouter;