import { Knex } from 'knex';
import Tables from '../../constants/schema';

const onUpdateTrigger = (table: string) => `
    CREATE TRIGGER ${table}_updated_at
      BEFORE UPDATE ON "${table}"
      FOR EACH ROW EXECUTE 
      PROCEDURE on_update_timestamp();
`;

const CurrTables = [Tables.banner];

exports.up = async (knex: Knex): Promise<void> => {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

	return knex.schema
		.createTable(Tables.banner, (table) => {
			table.increments();
			table.string('slug').notNullable().unique();

			table.specificType('images', 'integer ARRAY');

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})

		.then(async () => {
			const asynsFuncs = CurrTables.map((table: string) => knex.raw(onUpdateTrigger(table)));
			await Promise.all(asynsFuncs);
		});
};

exports.down = async (knex: Knex): Promise<void> => {
	await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');

	let tablesString = '';
	CurrTables.forEach((table: string) => {
		tablesString += `${table},`;
	});

	return knex.raw(`DROP TABLE IF EXISTS ${tablesString.slice(0, -1)} CASCADE;`);
};
