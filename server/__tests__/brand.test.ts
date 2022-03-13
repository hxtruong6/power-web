import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../app';
import { ApiStatus } from '../constants/apiConstant';

const BRAND_BASE_URL = '/api/brand';

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

describe('brand API', () => {
	const initOne = {
		id: uuidv4(),
		name: `brand test ${new Date().getTime()}`,
	};
	let createdone: any;

	it('[CREATE] Create new brand', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.post(`${BRAND_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send(initOne)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		createdone = response.body?.data;
		expect(createdone?.id).toBe(initOne.id);
		expect(createdone.createdBy).toBe(user.id);
	});

	it('[GET] Get all brand with length', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${BRAND_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.length).toBeGreaterThanOrEqual(1);
	});

	it('[GET BY ID] Get brand by id', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${BRAND_BASE_URL}/${initOne.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.id).toBe(initOne.id);
	});

	it('[UPDATE] Update name of brand', async () => {
		expect.hasAssertions();

		const updateName = `${initOne.name}--- update ${new Date().getTime()}`;
		const response = await request(app)
			.put(`${BRAND_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: initOne.id,
				name: updateName,
			})
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);

		const { data } = response.body;

		expect(data?.id).toBe(initOne.id);
		expect(data?.name).toBe(updateName);
		expect(data?.updatedBy).toBe(user.id);
	});

	it('[DELETE] Delete brand', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.delete(`${BRAND_BASE_URL}/${initOne.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
	});
});
