import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import apiMessage, { ApiMessage, UserApiMessage } from '../constants/apiMessage';
import { USER_ROLE, USER_TYPE } from '../constants/constants';
import { UserTable } from '../constants/schema';
import userService from '../services/user.service';
import { copyObject, hashPassword } from '../utils/commonFuncs';
import { errorRes, failRes, successRes } from '../utils/standardResponse';

function emailIsValid(email: string) {
	return /\S+@\S+\.\S+/.test(email);
}

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

class UserController {
	async login(req: Request, res: Response) {
		try {
			let { email } = req.body;
			const { password } = req.body;
			console.log('xxx 104 user: ', req.body);

			if (!emailIsValid(email)) {
				return errorRes(res, apiMessage.Common.INVALID_REQUEST);
			}

			email = normalizeEmail(email);

			const user = await userService.getByEmail(email);
			if (user) {
				const isPasswordMatching = await bcrypt.compare(password, user.password);
				if (isPasswordMatching) {
					delete user.password;

					// TODO: add role later in jwt.sign
					const accessTokenSecret: any = process.env.JWT_SECRET;
					const accessToken = jwt.sign(
						{ email: user.email, id: user.id },
						accessTokenSecret,
						{
							expiresIn: 60 * 60 * 24, // 1 day
						}
					);

					return successRes(res, { ...user, token: accessToken });
				}
				return failRes(res, { message: UserApiMessage.WRONG_PASSWORD });
			}
			return failRes(res, { message: UserApiMessage.EMAIL_NOT_FOUND });
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async register(req: Request, res: Response) {
		try {
			// TODO: uncomment to creating Admin user
			// const adminRole = USER_ROLE.ADMIN;
			const adminRole = null;

			let { email, userName } = req.body;

			const { password, userType } = req.body;
			email = String(email);
			userName = String(userName);
			// TODO: create user by userName here

			if (!email && !userName) {
				return errorRes(res, { message: apiMessage.Common.BAD_REQUEST });
			}

			if (!emailIsValid(email) || !(email.slice(email.length - 10) === '@gmail.com')) {
				return errorRes(res, { message: apiMessage.Common.BAD_REQUEST });
			}
			email = normalizeEmail(email);

			let role;

			if (userType === USER_TYPE.VENDOR) {
				role = adminRole || USER_ROLE.GUEST;
			}

			const existedUser = await userService.getByEmail(email);
			if (existedUser) {
				return failRes(res, { message: UserApiMessage.EXIST_EMAIL });
			}
			const hashedPassword = await hashPassword(password);

			const userData = { ...req.body, email, password: hashedPassword, role, userType };
			console.log(userData);

			const user = await userService.create(userData);

			return successRes(res, copyObject(user, [UserTable.password]));
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async get(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return failRes(res, { message: ApiMessage.MISSING_ID });
			}

			const data = await userService.getById(Number(id));
			if (!data) {
				return failRes(res, { message: ApiMessage.NOT_FOUND });
			}
			return successRes(res, data);
		} catch (error) {
			return errorRes(res, error);
		}
	}

	// update = async (req: Request, res: Response) => {
	// 	try {
	// 		const product = req.body;
	// 		if (!product || !product.id) {
	// 			return failRes(res, { message: ApiMessage.MISSING_ID });
	// 		}

	// 		const data = await db
	// 			.from(Tables.product)
	// 			.where({ id: product.id })
	// 			.update(convertSnakeKeys(product))
	// 			.returning('*');

	// 		if (data && data.length === 0) {
	// 			return failRes(res, { message: ApiMessage.INVALID_ID });
	// 		}
	// 		return successRes(res, { product: convertCamelKeys(data) });
	// 	} catch (error) {
	// 		return errorRes(res, error);
	// 	}
	// };

	// remove = async (req: Request, res: Response) => {
	// 	try {
	// 		const { id } = req.params;
	// 		if (!id) {
	// 			return failRes(res, { message: ApiMessage.MISSING_ID });
	// 		}

	// 		const data = await db
	// 			.from(Tables.product)
	// 			.where({ id })
	// 			.update(convertSnakeKeys({ deletedAt: new Date() }))
	// 			.returning([ProductTable.id]);
	// 		if (data && data.length === 0) {
	// 			return failRes(res, { message: ApiMessage.INVALID_ID });
	// 		}
	// 		return successRes(res, { product: convertCamelKeys(data[0]) });
	// 	} catch (error) {
	// 		return errorRes(res, error);
	// 	}
	// };
}
export default new UserController();
