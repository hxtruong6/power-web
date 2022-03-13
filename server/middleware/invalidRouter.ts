import { NextFunction, Request, Response } from 'express';
import { ApiCode } from '../constants/apiConstant';
import { ApiMessage } from '../constants/apiMessage';
import { errorRes } from '../utils/standardResponse';

export default (req: Request, res: Response, next: NextFunction) => {
	// Invalid request
	errorRes(
		res,
		{
			statusCode: ApiCode.NotFound,
			url: req.url,
			message: ApiMessage.INVALID_REQUEST,
		},
		undefined,
		ApiCode.NotFound
	);
};
