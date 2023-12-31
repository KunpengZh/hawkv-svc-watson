import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import path from 'path';
import BaseRouter from './routes';
import { CustomError } from '@shared/errors';


// Constants
const app = express();


/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'..','tempFiles/'),
    debug:true,
}));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}


/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use('/', BaseRouter);

// Error handling
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    console.error(err, true);
    const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
    return res.status(status).json({
        error: err.message,
    });
});


/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// // Set views dir
// const viewsDir = path.join(__dirname, 'views');
// app.set('views', viewsDir);

// // Set static dir
// const staticDir = path.join(__dirname, 'public');
// app.use(express.static(staticDir));

// // Serve index.html file
// app.get('*', (_: Request, res: Response) => {
//     res.sendFile('index.html', {root: viewsDir});
// });



// Export here and start in a diff file (for testing).
export default app;
