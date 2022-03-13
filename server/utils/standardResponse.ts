// JSEND standard
import { Response } from 'express';
import envConfig from '../config/env.config';
import { ApiCode, ApiStatus } from '../constants/apiConstant';
import Environment from '../constants/environment';

const successRes = (res: Response, data: any, codeStatus?: number) => {
	// console.log('---> result: ', data);
	res.status(codeStatus || ApiCode.Ok).send({
		status: ApiStatus.Success,
		data,
	});
};

const failRes = (res: Response, data: any, codeStatus?: number) => {
	if (envConfig.ENVIRONMENT === Environment.DEVELOPMENT) {
		// console.log(
		// 	'\nHeader: ',
		// 	res.req.headers,
		// 	'\nQuery: ',
		// 	res.req.query,
		// 	'\nParams: ',
		// 	res.req.params,
		// 	'\nBody: ',
		// 	res.req.body
		// );
		console.trace(data);
	}

	res.status(codeStatus || ApiCode.BadRequest).send({
		status: ApiStatus.Fail,
		data,
	});
};

const errorRes = (res: Response, error: any, message?: string, codeStatus?: number) => {
	/**
   * Required keys:
    status: Should always be set to "error".
    message: A meaningful, end-user-readable
            (or at the least log-worthy) message, explaining what went wrong.
    Optional keys:

    code: A numeric code corresponding to the error, if applicable
    data: A generic container for any other information about
          the error, i.e. the conditions that caused the error, stack traces, etc.
		  */

	if (envConfig.ENVIRONMENT === Environment.DEVELOPMENT) {
		// console.log(
		// 	'\nHeader: ',
		// 	res.req.headers,
		// 	'\nQuery: ',
		// 	res.req.query,
		// 	'\nParams: ',
		// 	res.req.params,
		// 	'\nBody: ',
		// 	res.req.body
		// );
		console.trace(error);
	}
	res.status(codeStatus || ApiCode.InternalServerError).send({
		status: ApiStatus.Error,
		message: error.message || message,
		code: codeStatus,
		data: error,
	});
};

export { successRes, failRes, errorRes };
