import axios, { AxiosInstance } from 'axios';

import path from 'path';
import fs from 'fs';
import { ClientId, ClientSecret, KiotVietTokenUrl } from '../config/kiotviet.config';

const filePath = 'config/kiotviet.token.json';

const getToken = () => {
	if (fs.existsSync(path.resolve(filePath))) {
		return JSON.parse(fs.readFileSync(path.resolve(filePath))?.toString());
	}

	return null;
	// TOD0:
	// 1. chec authen
	// 2. file exitst and return data file
	// 3. sync category then sync product with specs
};

async function getTokenApi() {
	const body = `scopes=PublicApi.Access&grant_type=client_credentials&client_id=${ClientId}&client_secret=${ClientSecret}`;

	const kiotVietToken = getToken();

	console.log(
		'KiotVietToken: ',
		kiotVietToken?.call_at + kiotVietToken?.expires_in,
		new Date().getTime(),
		kiotVietToken?.call_at + kiotVietToken?.expires_in * 1000 - new Date().getTime()
	);

	try {
		if (
			!kiotVietToken
			|| !kiotVietToken.expires_in
			|| !kiotVietToken.call_at
			|| new Date().getTime() - kiotVietToken.expires_in * 1000 >= kiotVietToken.call_at
		) {
			console.log('Get token...');

			const resp = await axios
				.post(KiotVietTokenUrl, body, {
					headers: {},
				});

			const data = resp?.data;

			fs.writeFileSync(
				filePath,
				JSON.stringify({ call_at: new Date().getTime(), ...data })
			);
		} else {
			console.info('Using existed valid token!');
		}
	} catch (error) {
		throw new Error(String(error));
	}
}

function KiotHttp(): AxiosInstance {
	const kiotVietToken = getToken();

	const token = kiotVietToken?.access_token;

	if (!token) throw new Error('Missing kiot viet token!!!');

	return axios.create({
		baseURL: 'https://public.kiotapi.com',
		timeout: 30000,
		headers: {
			Retailer: 'vitinhhungdunghcm',
			Authorization: `Bearer ${token}`,
		},
	});
}

export { getTokenApi };

export default KiotHttp;
