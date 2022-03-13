/* eslint-disable global-require */
import chalk from 'chalk';
import cors from 'cors';
import express, { json, NextFunction, Request, Response, urlencoded } from 'express';
// import path from 'path';
import { ApiMethod } from './constants/apiConstant';
import boolQueryParser from './middleware/boolQueryParser';
import errorRouter from './middleware/errorRouter';
import invalidRouter from './middleware/invalidRouter';
import routes from './routes';

require('xtlog').apply();
const { i } = require('xtlog');

const app = express();

// TODO set cors here
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// const allowlist = ['http://localhost:3000'];
// const corsOptionsDelegate = function (req:any, callback:any) {
// 	let corsOptions;
// 	if (allowlist.indexOf(req.header('Origin')) !== -1) {
// 		corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
// 	} else {
// 		corsOptions = { origin: false }; // disable CORS for this request
// 	}
// 	callback(null, corsOptions); // callback expects two parameters: error and options
// };
// app.use(cors(corsOptionsDelegate));
// const adminPath = path.join(__dirname, '..', 'admin/build');
// app.use(express.static(adminPath));
// app.get('/admin/*', (req, res) => {
// 	res.sendFile(path.join(adminPath, 'index.html'));
// });

app.use(urlencoded({ extended: true }));

app.use(json());

// eslint-disable-next-line no-unused-vars
app.use((req: Request, res: Response, next: NextFunction) => {
	switch (req.method) {
		case ApiMethod.GET:
			if (req.url.includes('/public/file')) break;
			i(chalk.bgBlueBright(req.method), '😇', req.url);
			break;
		case ApiMethod.POST:
			i(chalk.bgYellowBright(req.method), '🤓', req.url);
			break;
		case ApiMethod.PUT:
			i(chalk.bgMagentaBright(req.method), '🤗', req.url);
			break;
		case ApiMethod.DELETE:
			i(chalk.bgRedBright(req.method), '😷', req.url);
			break;

		default:
			i(chalk.bgCyanBright(req.method), req.url);
			break;
	}

	next();
});

app.use(boolQueryParser);

routes(app);

app.use(invalidRouter);

app.use(errorRouter);

export default app;
