import jwt from 'jsonwebtoken';

const verifyJwtToken = (token: string, secretKey: string) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, secretKey, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			return resolve(decoded);
		});
	});

export default verifyJwtToken;
