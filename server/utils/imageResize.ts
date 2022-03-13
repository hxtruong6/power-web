import { v4 } from 'uuid';
import sharp from 'sharp';
import path from 'path';
import { UploadImageFolder } from '../constants/constants';

class ImageResize {
	folder: string;

	prefix: string;

	filename: string;

	constructor({ filename = `${v4()}.png`, prefix = '', folder = UploadImageFolder }) {
		this.folder = folder;
		this.prefix = prefix;
		this.filename = filename;
	}

	async createThumbnail(buffer: any, opt = { width: 200, height: 200 }) {
		// eslint-disable-next-line no-underscore-dangle
		const _prefix = this.prefix ? `${this.prefix}__` : '';

		const url = `${_prefix}${opt.width}x${opt.height}__${this.filename}`;
		const filepath = this.filepath(url);

		// console.log('Thumbnail: ', { filename, filepath });
		const thumbnail = await sharp(buffer)
			.resize(opt.width, opt.height, {
				// size image 300x300
				fit: sharp.fit.inside,
				withoutEnlargement: true,
			})
			.toFile(filepath);

		return { url: `thumbnails/${url}`, file: thumbnail };
	}

	filepath(filename: string) {
		return path.resolve(`${this.folder}/${filename}`);
	}
}

export default ImageResize;
