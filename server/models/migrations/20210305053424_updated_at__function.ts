import { Knex } from 'knex';

const ON_UPDATE_TIMESTAMP_FUNCTION = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = 'DROP FUNCTION on_update_timestamp';

exports.up = async (knex: Knex): Promise<void> => {
	await knex.raw('CREATE SCHEMA IF NOT EXISTS public');
	return knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);
};

exports.down = (knex: Knex): Promise<void> => knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
