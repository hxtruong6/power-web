import { Knex } from 'knex';
import { v4 } from 'uuid';
import _ from 'lodash';
import Tables, { ProductTable, SpecTypeTable } from '../constants/schema';
import { IProductCreate, IProductSetSpecType } from '../interfaces/IProduct';
import db from '../models';
import {
	copyObject,
	normalizeSearhTerm,
	sqlCreateArrayString,
	toUrlString,
} from '../utils/commonFuncs';
import { convertCamelKeys, convertSnakeKeys } from '../utils/converts';
import { selectPublicProds } from '../constants/responseField';
import { PRICE_FILTER, PRODUCT_SORT_TYPE } from '../constants/constants';

// eslint-disable-next-line no-underscore-dangle
function _orderCondition(_instanceDB: Knex.QueryBuilder, tableName: string, sortType: string) {
	switch (sortType) {
		case PRODUCT_SORT_TYPE.NEWEST.value:
			_instanceDB.orderBy(`${tableName}.created_at`, 'desc');
			break;
		case PRODUCT_SORT_TYPE.MOST_BUY.value:
			// TODO: check again
			break;
		case PRODUCT_SORT_TYPE.PRICE_ASC.value:
			_instanceDB.orderBy(`${tableName}.price`, 'asc');
			break;
		case PRODUCT_SORT_TYPE.PRICE_DESC.value:
			_instanceDB.orderBy(`${tableName}.price`, 'desc');
			break;
		case PRODUCT_SORT_TYPE.LAST_MODIFIED.value:
			_instanceDB.orderBy(`${tableName}.updated_at`, 'desc');
			break;
		case PRODUCT_SORT_TYPE.A_Z.value:
			_instanceDB.orderBy(`${tableName}.title`, 'asc');
			break;
		case PRODUCT_SORT_TYPE.Z_A.value:
			_instanceDB.orderBy(`${tableName}.title`, 'desc');
			break;

		default:
			break;
	}
	return _instanceDB;
}

class ProductService {
	async getById(id: string, isPublic: Boolean = false) {
		const data = await db
			.from(Tables.product)
			.where({ id })
			.whereNull(ProductTable.deletedAt)
			.modify((queryBuilder) => {
				if (isPublic) {
					queryBuilder.where('is_active', true);
				}
			})
			.first()
			.then((r) => convertCamelKeys(r));

		return data;
	}

	async getByIdWithFullSpec(id: string, isPublic = false) {
		const selectFields = [
			...convertSnakeKeys(selectPublicProds).map((field) => `${Tables.product}.${field}`),
		];

		let product: any;
		await db.transaction(async (trx) => {
			product = await db
				.from(Tables.product)

				.leftJoin(
					Tables.specType,
					`${Tables.product}.${ProductTable.specTypeId}`,
					`${Tables.specType}.id`
				)
				.where(`${Tables.product}.id`, '=', id)
				.whereNull(`${Tables.product}.${ProductTable.deletedAt}`)
				.whereNull(`${Tables.specType}.${SpecTypeTable.deletedAt}`)
				.modify((queryBuilder) => {
					if (isPublic) {
						queryBuilder.select([
							...selectFields,
							`${Tables.product}.${ProductTable.specTypeId} as specTypeId`,
						]);
						queryBuilder.where(`${Tables.product}.is_active`, true);
						queryBuilder.select(selectFields);
					} else {
						queryBuilder.select([
							`${Tables.product}.*`,
							`${Tables.product}.${ProductTable.specTypeId} as specTypeId`,
						]);
					}
				})
				.first()
				.transacting(trx)
				.then((r) => convertCamelKeys(r));

			// console.log('xxx 012 prod: ', product);
		});

		return product;
	}

	async createSpecs(params: any) {
		return null;
	}

	async getAll(params: any, isPublic: Boolean = false) {
		const {
			limit,
			offset,
			sortType,
			searchTerm,
			filterQuery,
			categorySlug,
			categoryId,
			collectionSlug,
		} = params;
		const { specValues, specTypeIds, brands, prices } = filterQuery || {};
		// prices : {gte:0, lte: 10000000000}
		console.log('xxx 525 paramas: ', params);

		const withCategoryUrlJoin = `
				join
					(select
						pc1.product_id
					from
						${Tables.productCategory} pc1
						join ${Tables.category} c1
						on pc1.category_id = c1.id
					where
						c1.slug like '${categorySlug}'
					) pc1
				on ${Tables.product}.id = pc1.product_id
			`;

		const data = [1, 2, 3, 4];
		return {
			total: data.length > 0 ? Number(data[0]) : 0,
			products: data.map((item: any) => copyObject(item, ['total'])),
		};
	}

	async create(params: IProductCreate, userId: string) {
		const prod = await db
			.from(Tables.product)
			.insert(
				convertSnakeKeys({
					...params,
					slug: params.slug || toUrlString(params.title),
					createdBy: userId,
				})
			)
			.first()
			.returning('*')
			.then((r) => convertCamelKeys(r));

		return prod;
	}

	async insertOrUpdate(params: any, userId: string, isInsert: Boolean = true) {
		let additionalParam = {};
		if (isInsert) {
			additionalParam = {
				createdBy: userId,
				slug: params.slug || toUrlString(params.title),
			};
		} else {
			additionalParam = {
				updatedBy: userId,
			};
		}

		// await commonService.insertOrUpdate(Tables.product, [{ ...params, ...additionalParam }]);

		// const prod = await db
		// 	.from(Tables.product)
		// 	.insert(convertSnakeKeys({ ...params, ...additionalParam }))
		// 	.onConflict('id')
		// 	.merge()
		// 	.returning('*')
		// 	.then((r) => convertCamelKeys(r));
		// console.log('xxx prod: ', prod);

		// must be 'id' or 'sku'
		const field = params.id ? 'id' : 'sku';

		return db
			.from(Tables.product)
			.where({ [field]: params[field] })
			.first()
			.returning('*')
			.then((r) => convertCamelKeys(r));
	}

	async update(params: any, userId: string) {
		const data = await db
			.from(Tables.product)
			.where({ id: params.id })
			.update(
				convertSnakeKeys({
					...params,
					updatedBy: userId,
				})
			)
			.returning('*')
			.then((data) => convertCamelKeys(data));

		return data;
	}

	async remove(id: string, userId: string) {
		const data = await db
			.from(Tables.product)
			.where({ id })
			.update(convertSnakeKeys({ deletedAt: new Date(), deletedBy: userId }));
		return data === 1;
	}

	async setSpecType(params: IProductSetSpecType, userId: string) {
		const data = await db
			.from(Tables.product)
			.where({ id: params.productId })
			.update(
				convertSnakeKeys({
					specTypeId: params.specTypeId,
					updatedBy: userId,
				})
			)
			.returning('*')
			.then((r) => convertCamelKeys(r));
		return data?.[0];
	}
}

export default new ProductService();
