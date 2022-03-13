import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	const queries: any = req.query;
	Object.keys(queries).forEach((key: string) => {
		const val = String(queries[key]).toLowerCase();
		if (val === 'true') {
			queries[key] = true;
		} else if (val === 'false') {
			queries[key] = false;
		}
	});
	req.query = queries;
	next();
};
