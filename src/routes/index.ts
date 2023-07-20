import { Router } from 'express';
import shared from './shared';


// Export the base-router
const baseRouter = Router();
baseRouter.use('/shared',  shared);
export default baseRouter;
