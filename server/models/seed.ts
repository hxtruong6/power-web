import fs from 'fs';
import db from '.';
import Tables from '../constants/schema';
import { convertSnakeKeys } from '../utils/converts';

const DATA_FILE_PATH = './models/data.json';
const CHUNK_SIZE = 30;

function readJsonFile(filePath: string) {
	const rawdata = fs.readFileSync(filePath);
	return JSON.parse((rawdata as unknown) as string);
}

async function insertDataToDB(tableName: string, rows: any[]) {
	const chunkSize = CHUNK_SIZE;

	await db
		.batchInsert(tableName, rows, chunkSize)
		.returning('id')
		.then((ids) => {
			// console.log(ids);
		})
		.catch((error) => {
			console.error(error);
		});
}

async function deleteData() {
	console.log('Delete data in DB...');
	for (let i = 0; i < Object.keys(Tables).length; i += 1) {
		const table = Object.values(Tables)[i];
		// eslint-disable-next-line no-await-in-loop
		if (await db.schema.hasTable(table)) {
			console.log('Delete data in "', table, '" table');
			// eslint-disable-next-line no-await-in-loop
			await db.raw(`TRUNCATE "${table}" CASCADE;`);
		}
	}
}

async function main() {
	// TODO: uncomment if need delete data
	await deleteData();

	let data = readJsonFile(DATA_FILE_PATH);
	data = convertSnakeKeys(data);

	const tables = Object.keys(data);

	for (let i = 0; i < tables.length; i += 1) {
		const table = tables[i];
		console.log(`${table} table seeding...`);
		// eslint-disable-next-line no-await-in-loop
		await insertDataToDB(table, data[table]);
	}

	process.exit();
}

main();
