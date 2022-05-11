import ResponseWarp from "@shared/ResponseWarp";
import { Request, Response, Router } from 'express';
import { loadUserProfileList, createUserProfile, updateUserProfile, bulkCreateUserProfiles, loadAllUserProfiles } from '../services/userProfile';

const nodeRouter = Router();

nodeRouter.post('/loadUserProfileList', async function (req: Request, res: Response) {
    const { limit, bookmark, current = 0, direction = 'next', userRole, emailAddress } = req.body;
    res.json(await loadUserProfileList({ limit, bookmark, current, direction, userRole, emailAddress }))
});

nodeRouter.get('/loadAllUserProfiles', async function (req: Request, res: Response) {
    res.json(await loadAllUserProfiles());
});

nodeRouter.post('/createUserProfile', async function (req: Request, res: Response) {
    const { userProfile } = req.body;
    if (!userProfile || userProfile._id) {
        res.json(ResponseWarp.err(100, 'userProfile format incorrect'));
        return;
    }
    res.json(await createUserProfile(userProfile));
});

nodeRouter.post('/updateUserProfile', async function (req: Request, res: Response) {
    const { userProfile } = req.body;
    if (!userProfile || !userProfile._id) {
        res.json(ResponseWarp.err(100, 'userProfile format incorrect'));
        return;
    }
    res.json(await updateUserProfile(userProfile));
});


nodeRouter.post('/bulkCreateUserProfiles', async function (req: Request, res: Response) {
    const { userProfiles } = req.body;
    res.json(await bulkCreateUserProfiles(userProfiles));
})


export default nodeRouter;