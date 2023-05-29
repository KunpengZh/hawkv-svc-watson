import { Router } from 'express';
import { adminMW, checkQuery } from './middleware';
import shared from './shared';
import userGroup from './userGroup';
import userProfile from './userProfile';
import fileUploader from './fileUploadRouter';
import fileDownloader from './fileDownloadRouter';
import workflow from './workflow';

// Export the base-router
const baseRouter = Router();
baseRouter.use('/shared', adminMW, shared);
baseRouter.use('/userGroup', adminMW, userGroup);
baseRouter.use('/userProfile', adminMW, userProfile);
baseRouter.use('/files', adminMW, fileUploader);
baseRouter.use('/workflow', adminMW, workflow);
baseRouter.use('/download', checkQuery, fileDownloader);
export default baseRouter;
