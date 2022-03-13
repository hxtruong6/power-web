import path from 'path';
import { BasePath } from '../setting';

const UploadImageFolder = path.join(BasePath, 'public/images');

const PRODUCT_SORT_TYPE = {
	NEWEST: { value: 'NEWEST', name: 'Mới nhất' },
	MOST_BUY: { value: 'MOST_BUY', name: 'Mua nhiều nhất' },
	PRICE_ASC: { value: 'PRICE_ASC', name: 'Giá từ thấp đến cao' },
	PRICE_DESC: { value: 'PRICE_DESC', name: 'Giá từ cao đến thấp' },
	LAST_MODIFIED: { value: 'LAST_MODIFIED', name: 'Mới chỉnh sửa' },
	A_Z: { value: 'A_Z', name: 'Từ a-z' },
	Z_A: { value: 'Z_A', name: 'Từ z-a' },
};

const UPLOAD_FILE_TYPE = {
	PRODUCT: 'products',
	NEWS: 'news',
	CONTENT: 'content',
	UNKNOWN: 'unknown',
	BANNER: 'banner',
};

const USER_ROLE = {
	ADMIN: 'admin',
	EDITOR: 'editor',
	GUEST: 'guest',
};

const USER_TYPE = {
	CUSTOMER: 'customer',
	VENDOR: 'vendor',
};

const PRICE_FILTER = {
	MIN_PRICE: 0,
	MAX_PRICE: 10000000000000,
};

// eslint-disable-next-line import/prefer-default-export
export {
	UploadImageFolder,
	PRODUCT_SORT_TYPE,
	UPLOAD_FILE_TYPE,
	USER_ROLE,
	USER_TYPE,
	PRICE_FILTER,
};
