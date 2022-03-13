import Tables, { UserTable } from '../constants/schema';
import db from '../models';
import { filtered } from '../utils/commonFuncs';
import { convertCamelKeys, convertSnakeKeys } from '../utils/converts';

class UserService {
	async getByEmail(email: string) {
		const data = await db
			.from(Tables.user)
			.where({ email })
			.whereNull(UserTable.deletedAt)
			.then((data) => convertCamelKeys(data));
		if (data.length !== 1) {
			return null;
		}
		return data[0];
	}

	async getById(id: number) {
		const data = await db
			.from(Tables.user)
			.where({ id })
			.whereNull(UserTable.deletedAt)
			.then((data) => convertCamelKeys(data));

		if (data.length !== 1) {
			return null;
		}

		return filtered(data[0], { excepted: ['password'] });
	}

	async create(user: any) {
		const data = await db
			.from(Tables.user)
			.insert(convertSnakeKeys(user))
			.returning('*')
			.then((data) => convertCamelKeys(data));

		return data?.[0];
	}
}

export default new UserService();
