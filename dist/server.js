"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const errors_1 = require("@shared/errors");
// Constants
const app = (0, express_1.default)();
/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
// Common middlewares
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 500 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: path_1.default.join(__dirname, '..', 'tempFiles/'),
    debug: true,
}));
// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use((0, helmet_1.default)());
}
/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/
// Add api router
app.use('/', routes_1.default);
// Error handling
app.use((err, _, res, __) => {
    console.error(err, true);
    const status = (err instanceof errors_1.CustomError ? err.HttpStatus : http_status_codes_1.default.BAD_REQUEST);
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
exports.default = app;
