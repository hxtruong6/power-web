/* eslint-disable implicit-arrow-linebreak */
import { Request, Response } from 'express';
import { ApiCode } from '../constants/apiConstant';
import { errorRes } from '../utils/standardResponse';

export default (err: Error, req: Request, res: Response) =>
	errorRes(res, err, 'Server Error', ApiCode.InternalServerError);
