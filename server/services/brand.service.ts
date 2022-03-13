import Tables, { BrandTable } from '../constants/schema';
import db from '../models';
import { toUrlString } from '../utils/commonFuncs';
import { convertSnakeKeys } from '../utils/converts';

class BrandService {
	getById(id: number) {
		return db.from(Tables.brand).where({ id }).whereNull(BrandTable.deletedAt).first();
	}

	getAll() {
		return db.from(Tables.brand).select().whereNull(BrandTable.deletedAt);
	}

	async create(brand: any, userId: number) {
		const data = await db
			.from(Tables.brand)
			.insert(
				convertSnakeKeys({ ...brand, slug: toUrlString(brand?.name), createdBy: userId })
			)
			.returning('*');
		return data?.[0];
	}

	async update(brand: any, userId: number) {
		const data = await db
			.from(Tables.brand)
			.where({ id: brand.id })
			.update(convertSnakeKeys({ ...brand, updatedBy: userId }))
			.returning('*');
		return data?.[0];
	}

	async remove(id: number, userId: number) {
		const data = await db
			.from(Tables.brand)
			.where({ id })
			.update(convertSnakeKeys({ deletedAt: new Date(), deletedBy: userId }));
		return data === 1;
	}
}

export default new BrandService();
