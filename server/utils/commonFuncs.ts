import bcrypt from 'bcrypt';
import { Request } from 'express';
import _ from 'lodash';
import fs from 'fs';
import axios from 'axios';
import RequestWithUser from '../interfaces/requestWithUser.interface';

function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10);
}

const getPagination = (perPage: any, page: any) => {
	const limit = Number(perPage) || 20;
	const offset = (Number(page) - 1) * limit || 0;
	return { limit, offset };
};

function copyObject(obj: object, deleteAttributes: string[] = []) {
	const copyObj: { [key: string]: any } = { ...obj };
	if (deleteAttributes) {
		for (let i = 0; i < deleteAttributes.length; i += 1) {
			const key = deleteAttributes[i];
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				delete copyObj[key];
			}
		}
	}
	return copyObj;
}

function assertIRequest(req: Request | RequestWithUser): asserts req is RequestWithUser {
	if (!req) throw new Error('Request was not an IRequest');
}

function randomDate(start = new Date(2015, 0, 1), end = new Date()) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function makeNestedElemenent(el: { [key: string]: any }) {
	const result: any = {};

	Object.keys(el).forEach((key: string) => {
		const idx = key.indexOf('__');
		if (idx > 0) {
			const nestKey = key.slice(0, idx);
			const attr = key.slice(idx + 2);
			result[nestKey] = { ...result[nestKey], [attr]: el[key] };
		} else {
			result[key] = el[key];
		}
	});

	return result;
}

/* ============================================================
  Function: Download Image
============================================================ */

const downloadImage = (url: string, imagePath: string) =>
	axios({
		url,
		responseType: 'stream',
	}).then(
		(response) =>
			new Promise((resolve, reject) => {
				response.data
					.pipe(fs.createWriteStream(imagePath))
					.on('finish', () => resolve(true))
					.on('error', (e: Error) => reject(e));
			})
	);

const filtered = (
	raw: any,
	{ allowed = undefined, excepted = undefined }: { allowed?: string[]; excepted?: string[] }
) => {
	let filteredObj = raw;

	if (excepted) {
		filteredObj = Object.keys(raw)
			.filter((key: string) => !excepted?.includes(key))
			.reduce((obj: any, key: any) => {
				// eslint-disable-next-line no-param-reassign
				obj[key] = raw[key];
				return obj;
			}, {});
	}

	if (allowed) {
		filteredObj = Object.keys(filteredObj)
			.filter((key: string) => allowed?.includes(key))
			.reduce((obj: any, key: any) => {
				// eslint-disable-next-line no-param-reassign
				obj[key] = raw[key];
				return obj;
			}, {});
	}
	return filteredObj;
};

const convertArrayToObject = (array: any[], key: string) =>
	array.reduce(
		(obj, item) => ({
			...obj,
			[item[key]]: item,
		}),
		{}
	);

function createNestedObjFromArray(arr: any, key = 'id') {
	const obj = convertArrayToObject(arr, key);

	Object.values(obj).forEach((item: any) => {
		if (item.parentId) {
			obj[item.id].parent = { ...obj[item.parentId] };
			if (!obj[item.parentId]) return;

			if (obj[item.parentId]?.childrenId) {
				obj[item.parentId].childrenId.push(item.id);
			} else {
				obj[item.parentId].childrenId = [item.id];
			}
		}
	});

	return obj;
}

/* eslint-disable no-param-reassign */
function nonAccentVietnamese(str: string) {
	str = str.toLowerCase();
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	str = str.replace(/đ/g, 'd');
	// Some system encode vietnamese combining accent as individual utf-8 characters
	str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
	str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
	return str;
}

function toUrlString(str: string, replacedCharacter = '-') {
	if (!str) return '';
	str = String(nonAccentVietnamese(str))
		.replace(/[^a-zA-Z\d]+/g, ' ')
		.trim();
	return str
		.replace(/[`~@#$%^&*()_++'";:?<>\s,.]/g, replacedCharacter)
		.replace(/-{2,}/g, replacedCharacter);
}

function normalizeSearhTerm(str: string) {
	if (!str) return '';
	str = String(nonAccentVietnamese(str))
		.replace(/[^a-zA-Z\d]+/g, ' ')
		.trim();
	return str.replace(/[`~@#$%^&*()_++'";:?<>\s,.]/g, '&');
}

function sqlCreateArrayString(items: any[]) {
	return `('${items.join("','")}')`;
}

export {
	getPagination,
	copyObject,
	assertIRequest,
	randomDate,
	hashPassword,
	downloadImage,
	filtered,
	convertArrayToObject,
	toUrlString,
	sqlCreateArrayString,
	normalizeSearhTerm,
	createNestedObjFromArray,
};
