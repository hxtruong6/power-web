import fs from 'fs';

import path from 'path';

const BasePath = __dirname;

const publicPath = path.join(BasePath, 'public');

if (!fs.existsSync(publicPath)) {
	fs.mkdirSync(publicPath);
}

if (!fs.existsSync(path.join(publicPath, 'images'))) {
	fs.mkdirSync(path.join(publicPath, 'images'));
}

const subImgFolers = ['banner', 'content', 'news', 'products', 'thumbnails'];
subImgFolers.map((folder) => {
	if (!fs.existsSync(path.join(publicPath, 'images', folder))) {
		fs.mkdirSync(path.join(publicPath, 'images', folder));
	}
});

// eslint-disable-next-line import/prefer-default-export
export { BasePath };
