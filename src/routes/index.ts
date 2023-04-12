import { Router } from 'express';
import { adminMW } from './middleware';
import shared from './shared';
import userGroup from './userGroup';
import userProfile from './userProfile';
import formBuilder from './formBuilder'
import formList from './formList';

// Export the base-router
const baseRouter = Router();
baseRouter.use('/shared', adminMW, shared);
baseRouter.use('/userGroup', adminMW, userGroup);
baseRouter.use('/userProfile', adminMW, userProfile);
baseRouter.use('/formBuilder',adminMW,formBuilder);
baseRouter.use('/formList',adminMW,formList);
export default baseRouter;
