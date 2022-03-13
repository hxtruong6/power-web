import { Request, Response } from 'express';
import { ApiMessage } from '../constants/apiMessage';
import brandService from '../services/brand.service';
import { assertIRequest } from '../utils/commonFuncs';
import { convertCamelKeys } from '../utils/converts';
import { errorRes, failRes, successRes } from '../utils/standardResponse';

class BrandController {
	async getById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return failRes(res, { message: ApiMessage.MISSING_ID });
			}

			const data = await brandService.getById(Number(id));
			if (!data) {
				return failRes(res, { message: ApiMessage.NOT_FOUND });
			}
			return successRes(res, convertCamelKeys(data));
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const data: any = await brandService.getAll();

			return successRes(res, convertCamelKeys(data));
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async create(req: Request, res: Response) {
		try {
			assertIRequest(req);
			const brandData = req.body;

			const data = await brandService.create(brandData, req.userId);
			if (!data) {
				return failRes(res, { message: ApiMessage.CREATE_FAILED });
			}
			return successRes(res, convertCamelKeys(data));
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async update(req: Request, res: Response) {
		try {
			assertIRequest(req);
			const reqDate = req.body;
			if (!reqDate || !reqDate.id) {
				return failRes(res, { message: ApiMessage.MISSING_ID });
			}

			const data = await brandService.update(reqDate, req.userId);
			if (!data) {
				return failRes(res, { message: ApiMessage.UPDATE_FAILED });
			}
			return successRes(res, convertCamelKeys(data));
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async remove(req: Request, res: Response) {
		try {
			assertIRequest(req);
			const { id } = req.params;
			if (!id) {
				return failRes(res, { message: ApiMessage.MISSING_ID });
			}

			const data = await brandService.remove(Number(id), req.userId);
			if (!data) {
				return failRes(res, { message: ApiMessage.DELETE_FAILED });
			}
			return successRes(res, true);
		} catch (error) {
			return errorRes(res, error);
		}
	}
}
export default new BrandController();
