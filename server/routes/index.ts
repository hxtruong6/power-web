import { Express, Request, Response } from 'express';
import { ApiMessage } from '../constants/apiMessage';
import { errorRes } from '../utils/standardResponse';
import publicApi from './publicApi';

export default (app: Express) => {
	app.get('/', (req: Request, res: Response) => {
		res.send('🛑 API 🛑- Be carefully with virus in api!!! 🛑🚫☣️🚫');
	});

	app.use('/api', publicApi);

	app.use('*', (req: Request, res: Response) => {
		errorRes(res, { message: ApiMessage.ROUTE_NOT_FOUND });
	});
};
