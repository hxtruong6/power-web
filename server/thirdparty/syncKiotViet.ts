import { UploadImageFolder } from '../constants/constants';
import Tables from '../constants/schema';
import db from '../models';
import { downloadImage, toUrlString } from '../utils/commonFuncs';
import { convertSnakeKeys } from '../utils/converts';
import kiotVietApi from './kiotVietApi';

const PAGE_SIZE = 50;
const KIOT_VIET_USER_ID = '1';
let CountTotal = 0;

async function insertDataToDB(rows: any[], count: number) {
	const chunkSize = PAGE_SIZE;

	// eslint-disable-next-line no-param-reassign
	rows = rows.map((row) => ({ ...row, createdBy: KIOT_VIET_USER_ID }));

	return db
		.transaction(async (trx) => {
			await db
				.batchInsert(Tables.product, convertSnakeKeys(rows), chunkSize)
				.transacting(trx);
		})
		.then(() => {
			console.log(`${new Date().toTimeString()}:: Insert db success - page ${count}`);
		})
		.catch((error) => {
			console.error(error);
		});
}

async function updateCategory(rows: []) {
	// const menuId = '53e8d02c-3c4a-4a42-a935-ada79c60fb8c';
	const menuId = '0605463e-583a-4d40-993b-a5d24c02da42';
	// const menuId = 'fbe7ee3d-f1e4-465e-99a3-f10f87b22eaa';
	// const menuId = 'e9bfa3e5-31fc-4077-b754-88d721a06e56';

	const categoryId = '3cdd41c5-457a-43bd-bfaf-0c6ab1982ed1';
	// const ctg2 = '43eefcea-7609-4be8-9ac9-d1b9b04da78b';
	const targetCtg = 'Wifi ( Thiết bị thu wifi)';

	// console.log('rows:', rows);
	const items = rows.filter((r: any) => r.categoryName === targetCtg);
	console.log('Item: ', items);
	CountTotal += items.length;

	if (items.length === 0) return null;
	return db
		.transaction(async (trx) => {
			const queries: any = [];
			items.forEach((item: any) => {
				const query = db
					.from('product')
					.where('code', item.code)
					.update({
						menu_id: menuId,
					})
					.returning('id')
					.transacting(trx);
				// This makes every update be in the same transaction
				queries.push(query);
			});

			const res = await Promise.all(queries); // Once every query is written
			// console.log('rddd -', res);
			const prodCtgs = res.filter((r:any) => r.length === 1).map((r: any) => ({
				productId: r[0],
				categoryId,
				createdBy: KIOT_VIET_USER_ID,
			}));
			// console.log('xx orid', prodCtgs);
			await db
				.batchInsert(Tables.productCategory, convertSnakeKeys(prodCtgs), items.length)
				.transacting(trx);

			// Create new product categor if has child - parent category
			// const prodCtgs2 = res.filter((r:any) => r.length === 1).map((r: any) => ({
			// 	productId: r[0],
			// 	categoryId: ctg2,
			// 	createdBy: KIOT_VIET_USER_ID,
			// }));
			// await db
			// 	.batchInsert(Tables.productCategory, convertSnakeKeys(prodCtgs2), items.length)
			// 	.transacting(trx);
		})
		.then(() => {
			console.log(`${new Date().toTimeString()}:: Update menuId+Ctg success. TOTAL = ${CountTotal}`);
		})
		.catch((error) => {
			console.error(error);
		});
}

async function productSync() {
	const total = await kiotVietApi.countProduct();

	const N = total / PAGE_SIZE + (total % PAGE_SIZE !== 0 ? 1 : 0);
	// const N = 1;
	console.log('Total N= ', N);

	const syncDbFuncs: any = [];

	for (let page = 0; page < N; page += 1) {
		// eslint-disable-next-line no-await-in-loop
		const data = await kiotVietApi.getAllProduct(PAGE_SIZE, page * PAGE_SIZE);

		const products = data?.data;

		if (!products || products.length === 0) {
			console.log('Not thing to sync!');
			break;
		}

		const prods = products
			.filter((p:any) => p.images?.length > 0)
			.map((product: any) => {
			// console.dir(product, { depth: null });
				const imagePaths = product?.images?.map((imgUrl: string) => {
					const imgPath = `products/${product.code}.png`;
					downloadImage(imgUrl, `${UploadImageFolder}/${imgPath}`);
					return imgPath;
				});
				// console.log('xxx image: ', imagePaths);

				const inventory = product?.inventories?.[0]?.onHand || 0;
				// const reservedCount = product?.inventories?.[0]?.reserved || 0;

				return {
					price: product.basePrice,
					isSale: product.allowsSale,
					description: product.description,
					isActive: product.isActive,
					title: product.name,
					slug: toUrlString(product.name),
					sku: product.code,
					images: imagePaths || [],
					inventory,
					createdAt: product.createdDate
				};
			});

		console.log(`Sync data at Page ${page} :`);
		// console.log('Prod: ', JSON.stringify(prods, null, 4));
		console.log(prods.map((r:any) => r.title));
		// eslint-disable-next-line no-await-in-loop
		syncDbFuncs.push(insertDataToDB(prods, page));

		// For update category + update menu
		// const syncProds = products.map((product: any) => ({
		// 	code: product.code,
		// 	categoryName: product.categoryName,
		// }));
		// // eslint-disable-next-line no-await-in-loop
		// syncDbFuncs.push(updateCategory(syncProds));
	}

	await Promise.all(syncDbFuncs);
}

async function categorySync() {
	const data = await kiotVietApi.getAllCategory();
	console.log('xxx ctgs: ', data);
}

async function main() {
	if (!KIOT_VIET_USER_ID) throw new Error('Missing UserID for KiotViet');

	try {
		await kiotVietApi.authentication();
		await productSync();
		// await categorySync();

		console.info('Synced!');

		process.exit(0);
	} catch (error) {
		console.error('Sync kiot viet failed!', (error as any)?.message);
		console.trace(error);
		process.exit(1);
	}
}

main();
