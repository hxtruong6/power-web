import { Request } from 'express';
import moment from 'moment';
import multer from 'multer';
import path from 'path';
import { UploadImageFolder } from '../constants/constants';

const storage = () =>
	multer.diskStorage({
		destination: (req, file, cb) => {
			const prefix = String(req.query.prefix); // as a folder roles
			cb(null, `${UploadImageFolder}/${prefix}`);
		},
		filename: (req: Request, file, cb) => {
			const filename = moment(new Date()).format('YYYY-MM-DD__HH-mm-ss.SSS');
			cb(null, `${filename}${path.extname(file.originalname)}`);
		},
	});

const ALLOW_MIME_TYPE = ['image/jpeg', 'image/gif', 'image/png', 'image/webp', 'image/jpg'];
const fileFilter = (req: Request, file: any, cb: any) => {
	if (ALLOW_MIME_TYPE.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = () =>
	multer({
		fileFilter,
		limits: {
			fileSize: 15 * 1024 * 1024, // 5MB
		},
		storage: storage(),
	});

export default upload;
