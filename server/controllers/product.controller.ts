import { Request, Response } from 'express';
import apiMessage from '../constants/apiMessage';
import productService from '../services/product.service';
import { assertIRequest, getPagination } from '../utils/commonFuncs';
import { errorRes, failRes, successRes } from '../utils/standardResponse';

class ProductController {
	async getById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return failRes(res, { message: apiMessage.Common.MISSING_ID });
			}

			const { fullSpecs } = req.query;

			let product;

			if (fullSpecs) {
				product = await productService.getByIdWithFullSpec(id);
			} else {
				product = await productService.getById(id);
			}

			if (!product) {
				return failRes(res, { message: apiMessage.Common.NOT_FOUND });
			}
			return successRes(res, product);
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const { perPage, page, ...reqParams } = req.body;
			// console.log('xxx 441 Prods: ', req.body);

			let limit = 20;
			let offset = 0;
			if (perPage && page) {
				const pagi = getPagination(perPage, page);
				limit = pagi.limit;
				offset = pagi.offset;
			} else if (perPage) {
				limit = perPage;
			}

			const result = await productService.getAll({ limit, offset, ...reqParams });

			return successRes(res, result);
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async insert(req: Request, res: Response) {
		try {
			assertIRequest(req);
			const productData = req.body;

			const product = await productService.insertOrUpdate(productData, req.userId);
			if (!product) {
				return failRes(res, { message: apiMessage.Common.UPDATE_FAILED });
			}
			return successRes(res, product);
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async update(req: Request, res: Response) {
		try {
			assertIRequest(req);
			const productData = req.body;
			if (!productData || !productData.id) {
				return failRes(res, { message: apiMessage.Common.MISSING_ID });
			}

			const product = await productService.update(productData, req.userId);
			if (!product) {
				return failRes(res, { message: apiMessage.Common.UPDATE_FAILED });
			}
			return successRes(res, product);
		} catch (error) {
			return errorRes(res, error);
		}
	}

	async remove(req: Request, res: Response) {
		try {
			assertIRequest(req);
			const { id } = req.params;
			if (!id) {
				return failRes(res, { message: apiMessage.Common.MISSING_ID });
			}

			const product = await productService.remove(id, req.userId);
			if (!product) {
				return failRes(res, { message: apiMessage.Common.DELETE_FAILED });
			}
			return successRes(res, {});
		} catch (error) {
			return errorRes(res, error);
		}
	}

	// async attachToCategory(req: Request, res: Response) {
	// 	try {
	// 		assertIRequest(req);
	// 		const { id, categoryIds } = req.body;
	// 		if (!id || !categoryIds) {
	// 			return failRes(res, { message: apiMessage.Product.MISSING_PRODUCT_CATEGORY_ID });
	// 		}

	// 		const data = await productCategoryService.attachToProduct(
	// 			{ productId: id, categoryIds },
	// 			req.userId
	// 		);

	// 		return successRes(res, data);
	// 	} catch (error) {
	// 		return errorRes(res, error);
	// 	}
	// }

	async setSpecType(req: Request, res: Response) {
		try {
			assertIRequest(req);
			const { id, specTypeId } = req.body;
			if (!id || !specTypeId) {
				return failRes(res, { message: apiMessage.Product.MISSING_PRODUCT_CATEGORY_ID });
			}

			const data = await productService.setSpecType(
				{ productId: id, specTypeId },
				req.userId
			);

			return successRes(res, data);
		} catch (error) {
			return errorRes(res, error);
		}
	}

	/**
	 * This is same with get all but it have additional parameter: isPublic = true
	 * @param req
	 * @param res
	 * @returns
	 */
	async getAllPl(req: Request, res: Response) {
		try {
			const { perPage, page, ...reqParams } = req.body;

			// let limit = 20;
			// let offset = 0;
			// if (perPage && page) {
			// 	const pagi = getPagination(perPage, page);
			// 	limit = pagi.limit;
			// 	offset = pagi.offset;
			// }

			// const result = await productService.getAll({ limit, offset, ...reqParams }, true);
			const result = [{ name: 'minmin', old: 22, lover: 'gia dep trai' }];

			return successRes(res, result);
		} catch (error) {
			return errorRes(res, error);
		}
	}

	// public
	// async getByConditions(req: Request, res: Response) {
	// 	try {
	// 		const { specType } = req.query;

	// 		let result: any;
	// 		if (specType) {
	// 			result = await specTypeService.getAll({ isPublic: true });
	// 		}

	// 		return successRes(res, result);
	// 	} catch (error) {
	// 		return errorRes(res, error);
	// 	}
	// }

	async getByIdPl(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const result = await productService.getByIdWithFullSpec(id, true);

			return successRes(res, result);
		} catch (error) {
			return errorRes(res, error);
		}
	}
}
export default new ProductController();
