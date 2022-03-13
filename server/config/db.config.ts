import envConfig from './env.config';

const pqConnStr = envConfig.DB_URL_DEV
	? envConfig.DB_URL_DEV
	: `postgres://${envConfig.DB_USER_NAME}:${envConfig.DB_PASS}@${envConfig.DB_HOST}:${envConfig.DB_PORT}/${envConfig.DB_NAME}`;

console.log('DB: ', pqConnStr);
const createUnixSocketPoolConnection = () => ({
	user: 'postgres', // e.g. 'my-user'
	password: 'pass123', // e.g. 'my-user-password'
	database: 'postgres', // e.g. 'my-database'
	host: '/cloudsql/hung-dung-web:asia-southeast1:hd',
});

export { createUnixSocketPoolConnection };
export default pqConnStr;
