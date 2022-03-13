import express from 'express';
import productPlRouter from './productPl.router';
import brandPlRouter from './brandPl.router';
import userPlRouter from './userPl.router';

const publicApi = express.Router();

publicApi.get('/', (req, res) =>
	res.send('🛑 Public API 🛑- Be carefully with virus in api!!! 🛑🚫☣️🚫')
);
publicApi.use('/products', productPlRouter);
publicApi.use('/brands', brandPlRouter);
publicApi.use('/user', userPlRouter);

export default publicApi;
