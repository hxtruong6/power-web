/* eslint-disable import/prefer-default-export */
import pqConnStr, { createUnixSocketPoolConnection } from './config/db.config';
import envConfig from './config/env.config';
import Environment from './constants/environment';

interface KnexConfig {
	[key: string]: object;
}

const knexConfig: KnexConfig = {
	development: {
		client: 'pg',
		connection: pqConnStr,
		// envConfig.ENVIRONMENT === Environment.DEVELOPMENT
		// 	? pqConnStr
		// 	: createUnixSocketPoolConnection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: `${__dirname}/models/migrations`,
		},
		seeds: {
			directory: `${__dirname}/models/seeds`,
		},
	},

	staging: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password',
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
	},

	production: {
		client: 'pg',
		connection: pqConnStr,
		// envConfig.ENVIRONMENT === Environment.DEVELOPMENT
		// 	? pqConnStr
		// 	: createUnixSocketPoolConnection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: `${__dirname}/models/migrations`,
		},
		seeds: {
			directory: `${__dirname}/models/seeds`,
		},
	},
};

export default knexConfig;
