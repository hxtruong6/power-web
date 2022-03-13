import { body, validationResult, param, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorRes } from '../utils/standardResponse';
import { UPLOAD_FILE_TYPE } from '../constants/constants';

const userValidationRules = () => [
	// username must be an email
	body('username').isEmail(),
	// password must be at least 5 chars long
	body('password').isLength({ min: 5 }),
];

const orderValidationRoles = () => [
	body('total').isFloat(),
	body('firstName').isString(),
	body('fullName').isString(),
	body('phone').isString().notEmpty(),
	body('deliveryAddress').isString(),
	// body('deliveryWay').isInt(),
	// body('paymentWay').isInt(),
	body('items').isArray({ min: 1 }),
];

const uploadFileValidationRoles = () => [
	query('prefix').isIn([...Object.values(UPLOAD_FILE_TYPE)]),
];

const validateMW = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors: any = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	console.log('Validate error: ', { quey: req.query, param: req.params, body: req.body }, errors);
	return errorRes(res, extractedErrors, JSON.stringify(extractedErrors), 422);
};

export { validateMW, orderValidationRoles, uploadFileValidationRoles };
