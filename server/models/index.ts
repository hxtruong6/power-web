import Knex from 'knex';
import envConfig from '../config/env.config';
import knexConfig from '../knexfile';

const environment = envConfig.ENVIRONMENT || 'development';

const db = Knex(knexConfig[environment]);

db.raw('SELECT 1')
	.then(() => {
		console.log('PostgreSQL connected');
	})
	.catch((e: any) => {
		console.log('PostgreSQL not connected');
		console.error(e);
	});

export default db;
