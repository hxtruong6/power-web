import * as dotenv from 'dotenv';

dotenv.config();

const { env } = process;
console.log('NODE_ENV: ', env.NODE_ENV);
const envConfig = {
	ENVIRONMENT: env.NODE_ENV,
	DB_USER_NAME: env.DB_USER_NAME,
	DB_PASS: env.DB_PASS,
	DB_NAME: env.DB_NAME,
	DB_HOST: env.DB_HOST,
	DB_PORT: env.DB_PORT,
	DB_URL_DEV: env.DB_URL_DEV,
};

export default envConfig;
