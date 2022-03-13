import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../app';
import { ApiStatus } from '../constants/apiConstant';

const CATEGORY_BASE_URL = '/api/category';

let token: any;
let user: any = {
	email: `test_user_${new Date().getTime()}@gmail.com`,
	password: 'pass_123',
};

beforeAll(async () => {
	await request(app)
		.post('/api/user/register')
		.send(user)
		.expect(200)
		.then((response) => {
			// eslint-disable-next-line jest/no-standalone-expect
			expect(response.body?.status).toBe(ApiStatus.Success);
		});

	const data = await request(app).post('/api/user/login').send(user).expect(200);

	token = data.body.data?.token;
	// eslint-disable-next-line jest/no-standalone-expect
	expect(token).not.toBeNull();
	user = { ...user, ...data.body.data };
	// eslint-disable-next-line jest/no-standalone-expect
	expect(user).toBeTruthy();
});

describe('category API', () => {
	const initCategory = {
		id: uuidv4(),
		name: `category test ${new Date().getTime()}`,
	};
	let createdCategory: any;

	it('[CREATE] Create new category', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.post(`${CATEGORY_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send(initCategory)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		createdCategory = response.body?.data?.category;
		expect(createdCategory?.id).toBe(initCategory.id);
		expect(createdCategory.createdBy).toBe(user.id);
	});

	it('[GET] Get all category with length', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${CATEGORY_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.categories?.length).toBeGreaterThanOrEqual(1);
	});

	it('[GET BY ID] Get category by id', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${CATEGORY_BASE_URL}/${initCategory.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.category?.id).toBe(initCategory.id);
	});

	it('[UPDATE] Update name of category', async () => {
		expect.hasAssertions();

		const updateName = `${initCategory.name}--- update ${new Date().getTime()}`;
		const response = await request(app)
			.put(`${CATEGORY_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: initCategory.id,
				name: updateName,
			})
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);

		const { category } = response.body.data;

		expect(category?.id).toBe(initCategory.id);
		expect(category?.name).toBe(updateName);
		expect(category?.updatedBy).toBe(user.id);
	});

	it('[DELETE] Delete category', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.delete(`${CATEGORY_BASE_URL}/${initCategory.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
	});
});
