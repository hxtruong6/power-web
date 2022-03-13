import request from 'supertest';
import { v1, v4 } from 'uuid';
import app from '../app';
import { ApiStatus } from '../constants/apiConstant';

const PRODUCT_BASE_URL = '/api/product';

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

describe('product API', () => {
	const initProduct = {
		id: v4(),
		name: `product test ${new Date().getTime()}`,
		code: v1(),
	};
	let createdProduct: any;

	it('[CREATE] Create new product', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.post(`${PRODUCT_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send(initProduct)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		createdProduct = response.body?.data?.product;
		expect(createdProduct?.id).toBe(initProduct.id);
		expect(createdProduct.createdBy).toBe(user.id);
	});

	it('[GET] Get all products', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${PRODUCT_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.products?.length).toBeGreaterThanOrEqual(1);
	});

	// TODO: make sure has data with lenght > perPage*(page-1)
	it('[GET] Get all product with pagination', async () => {
		expect.hasAssertions();
		const perPage = 1;
		const page = 1;
		const response = await request(app)
			.get(`${PRODUCT_BASE_URL}?perPage=${perPage}&page=${page}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		const data = response.body;
		expect(data.status).toBe(ApiStatus.Success);
		expect(data?.data?.products?.total).toBeGreaterThanOrEqual(1);
		expect(data?.data?.products?.data).toHaveLength(perPage);
	});

	it('[GET BY ID] Get product by id', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${PRODUCT_BASE_URL}/${initProduct.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.product?.id).toBe(initProduct.id);
	});

	it('[UPDATE] Update name of product', async () => {
		expect.hasAssertions();

		const updateName = `${initProduct.name}--- update ${new Date().getTime()}`;
		const response = await request(app)
			.put(`${PRODUCT_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: initProduct.id,
				name: updateName,
			})
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);

		const { product } = response.body.data;
		expect(product?.id).toBe(initProduct.id);
		expect(product?.name).toBe(updateName);
		expect(product?.updatedBy).toBe(user.id);
	});

	it('[DELETE] Delete product', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.delete(`${PRODUCT_BASE_URL}/${initProduct.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
	});

	it('[ATTACH TO CATEGORY] Attach to category', async () => {
		expect.hasAssertions();

		const categoryRes = await request(app)
			.post('/api/category')
			.set('Authorization', `Bearer ${token}`)
			.send({ id: v4(), name: `category test ${new Date().getTime()}` })
			.expect(200);

		expect(categoryRes.body.status).toBe(ApiStatus.Success);
		const category = categoryRes.body?.data?.category;
		expect(category).toBeTruthy();

		const response = await request(app)
			.post(`${PRODUCT_BASE_URL}/category`)
			.set('Authorization', `Bearer ${token}`)
			.send({ id: initProduct.id, categoryId: category.id })
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
	});
});
