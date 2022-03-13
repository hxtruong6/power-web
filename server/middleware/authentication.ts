import { NextFunction, Response } from 'express';
import { ApiCode } from '../constants/apiConstant';
import { AuthApiMessage, UserApiMessage } from '../constants/apiMessage';
import userService from '../services/user.service';
import { failRes } from '../utils/standardResponse';
import verifyJwtToken from '../utils/verifyJWTToken';

async function authMiddleware(req: any, res: Response, next: NextFunction) {
	const { authorization } = req.headers;

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		const token = authorization.split(' ')[1];
		const secret: any = process.env.JWT_SECRET;
		try {
			// console.log('Token: ', token);
			const verificationResponse: any = await verifyJwtToken(token, secret);
			const { id } = verificationResponse;
			const user = await userService.getById(Number(id));
			// console.log('user: ', user);

			if (user) {
				req.userId = id;
				// TODO: add role here
				return next();
			}

			return failRes(res, { message: UserApiMessage.INVALID_USER }, ApiCode.BadRequest);
		} catch (error) {
			return failRes(res, { message: AuthApiMessage.INVALID_TOKEN }, ApiCode.Unauthorized);
		}
	} else {
		return failRes(res, { message: AuthApiMessage.MISSING_TOKEN }, ApiCode.BadRequest);
	}
}

export default authMiddleware;
