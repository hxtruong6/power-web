import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../app';
import { ApiStatus } from '../constants/apiConstant';

const MENU_BASE_URL = '/api/menu';

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

describe('menu API', () => {
	const initMenu = {
		id: uuidv4(),
		name: `menu test ${new Date().getTime()}`,
	};
	let createdMenu: any;

	it('[CREATE] Create new menu', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.post(`${MENU_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send(initMenu)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		createdMenu = response.body?.data?.menu;
		expect(createdMenu?.id).toBe(initMenu.id);
		expect(createdMenu.createdBy).toBe(user.id);
	});

	it('[GET] Get all menu with length', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${MENU_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.menus?.length).toBeGreaterThanOrEqual(1);
	});

	it('[GET BY ID] Get menu by id', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.get(`${MENU_BASE_URL}/${initMenu.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
		expect(response.body.data?.menu?.id).toBe(initMenu.id);
	});

	it('[UPDATE] Update name of Menu', async () => {
		expect.hasAssertions();

		const updateName = `${initMenu.name}--- update ${new Date().getTime()}`;
		const response = await request(app)
			.put(`${MENU_BASE_URL}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				id: initMenu.id,
				name: updateName,
			})
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);

		const { menu } = response.body.data;

		expect(menu?.id).toBe(initMenu.id);
		expect(menu?.name).toBe(updateName);
		expect(menu?.updatedBy).toBe(user.id);
	});

	it('[DELETE] Delete Menu', async () => {
		expect.hasAssertions();

		const response = await request(app)
			.delete(`${MENU_BASE_URL}/${initMenu.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.status).toBe(ApiStatus.Success);
	});
});
