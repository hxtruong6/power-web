/* eslint-disable no-param-reassign */
import fs from 'fs';
import { v4 } from 'uuid';
import { hashPassword } from '../utils/commonFuncs';

const data: any = {};

const DATA_FILE_PATH = './models/data.json';

const USERS = ['hxtruong@gmail.com', 'kiotviet@gmail.com'];

const userGenerator = async (length: number = 10) => {
	console.info('Generating User...');
	// const roleIds = data['roles'].map((role) => role.id);

	const rows = [];
	for (let index = 0; index < USERS.length; index += 1) {
		// eslint-disable-next-line no-await-in-loop
		const hashedPass = await hashPassword('pass@123');
		rows.push({
			id: v4(),
			firstName: USERS[index].split('@')[0],
			fullName: USERS[index].split('@')[0],
			email: USERS[index],
			password: hashedPass,
		});
	}

	data.user = rows;
};

const menuGenerator = (length: number = 10) => {
	console.info('Generating menu...');
	const userIds: [] = data.user.map((r: any) => r.id);

	const rows: any = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			name: `menu 0${index}`,
			createdBy: userIds[index % userIds.length],
		});
	}

	for (let i = length / 2; i < length; i += 1) {
		rows[i].parentId = rows[Math.ceil(Math.random() * (length / 2))].id || null;
	}

	data.menu = rows;
};

const categoryGenerator = (length: number = 10) => {
	console.info('Generating category...');
	const userIds: [] = data.user.map((r: any) => r.id);
	const menuIds: [] = data.menu.map((r: any) => r.id);

	const rows = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			name: `category 0${index}`,
			menuId: menuIds[index % menuIds.length],
			createdBy: userIds[index % userIds.length],
		});
	}

	data.category = rows;
};

const brandGenerator = (length: number = 10) => {
	console.info('Generating brand...');
	const userIds: [] = data.user.map((r: any) => r.id);

	const rows = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			name: `brand 0${index}`,
			createdBy: userIds[index % userIds.length],
		});
	}

	data.brand = rows;
};

const newsGenerator = (length: number = 10) => {
	console.info('Generating news...');
	const userIds: [] = data.user.map((r: any) => r.id);

	const rows = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			content: `new 0${index}`,
			createdBy: userIds[index % userIds.length],
		});
	}

	data.news = rows;
};

const specTypeGenerator = (length: number = 10) => {
	console.info('Generating spec type...');
	const userIds: [] = data.user.map((r: any) => r.id);

	const rows = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			name: `spec type 0${index}`,
			createdBy: userIds[index % userIds.length],
		});
	}

	data.specType = rows;
};

const specificationGenerator = (length: number = 10) => {
	console.info('Generating specification...');
	const userIds: [] = data.user.map((r: any) => r.id);
	const specTypes: any[] = data.specType.map((r: any) => r.id);
	// const prods: any[] = data.product.map((r: any) => r.id);

	const rows = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			name: `specification 0${index}`,
			specTypeId: specTypes[index % specTypes.length],
			// productId: prods[index % prods.length],
			createdBy: userIds[index % userIds.length],
		});
	}

	data.specification = rows;
};

const specPartGenerator = (length: number = 10) => {
	console.info('Generating spec part...');
	const userIds: [] = data.user.map((r: any) => r.id);
	const specTypeIds: [] = data.specType.map((r: any) => r.id);

	const rows = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			name: `spec part 0${index}`,
			createdBy: userIds[index % userIds.length],
			specTypeId: specTypeIds[index % specTypeIds.length],
			position: index,
		});
	}

	data.specPart = rows;
};

const specValueGenerator = (length: number = 10) => {
	console.info('Generating spec value...');
	const userIds: [] = data.user.map((r: any) => r.id);
	const specIds: [] = data.specification.map((r: any) => r.id);
	const specPartIds: [] = data.specPart.map((r: any) => r.id);

	const rows = [];
	for (let index = 1; index <= length; index += 1) {
		rows.push({
			id: v4(),
			value: `spec value 0${index}`,
			specPartId: specPartIds[index % specPartIds.length],
			specId: specIds[index % specIds.length],

			createdBy: userIds[index % userIds.length],
		});
	}

	data.specValue = rows;
};

const productGenerator = () => {
	console.info('Generating product...');
	const userIds: [] = data.user.map((r: any) => r.id);
	const specs: [] = data.specification.map((r: any) => r.id);

	const rows = [];

	const rowsLength = specs.length;

	for (let index = 1; index <= rowsLength; index += 1) {
		rows.push({
			id: v4(),
			name: `product 0${index}`,
			price: Math.floor(Math.random() * 100),
			specId: specs[index % specs.length],
			code: String(v4()).slice(0, 8).toUpperCase(),
			allowSale: true,

			createdBy: userIds[index % userIds.length],
		});
	}

	data.product = rows;
};

(async () => {
	await userGenerator(3);
	// menuGenerator(6);
	// categoryGenerator(10);
	// brandGenerator(5);
	// specTypeGenerator(3);
	// specificationGenerator(10);
	// specPartGenerator(15);
	// specValueGenerator(30);
	// newsGenerator(10);
	// productGenerator();

	fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), (err) => {
		if (err) throw err;
		console.log('Write file completed!');
	});
})();
