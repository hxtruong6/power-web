import { table } from 'console';
import { Knex } from 'knex';
import Tables from '../../constants/schema';
import { copyObject } from '../../utils/commonFuncs';

const onUpdateTrigger = (table: string) => `
    CREATE TRIGGER ${table}_updated_at
      BEFORE UPDATE ON "${table}"
      FOR EACH ROW EXECUTE 
      PROCEDURE on_update_timestamp();
`;

exports.up = async (knex: Knex): Promise<void> => {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

	return knex.schema
		.createTable(Tables.user, (table) => {
			// table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.increments();
			table.string('first_name');
			table.string('full_name');
			table.string('email').unique();
			table.string('user_name').unique();
			table.string('password').notNullable();
			table.boolean('is_actived').notNullable().defaultTo(true);
			table.string('avatar');
			table
				.enu('user_type', ['customer', 'vendor'], {
					useNative: true,
					enumName: 'user_type',
				})
				.notNullable()
				.defaultTo('customer');
			table.enu('role', ['guest', 'editor', 'admin'], {
				useNative: true,
				enumName: 'role',
			});

			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.timestamp('last_login');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable('user_log', (table) => {
			table.increments();
			table.integer('user_id').references('user.id');
			table.string('last_token').unique();
			table.timestamp('updated_at').defaultTo(knex.fn.now());
			table.timestamp('deleted_at');
		})
		.createTable('image', (table) => {
			table.increments();
			table.string('url').notNullable();
			table.text('link');
			table.text('caption');
			table.text('alternative_text');
			table.string('ext');
			table.string('mime');
			table.float('size');

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.alterTable('image', (table) => {
			table.integer('thumbnail_id').nullable().references('image.id');
		})
		.createTable('category', (table) => {
			table.increments();
			table.string('name');
			table.integer('parent_id');
			table.string('slug').unique();
			table.integer('level').defaultTo(0);
			table.boolean('is_title').defaultTo(false);

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable('spec_type', (table) => {
			table.increments();
			table.string('name').unique();
			table.string('description');
			table.string('slug').unique();

			table.boolean('use_build_pc').notNullable().defaultTo(false);
			table.string('build_pc_name').unique().nullable();

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable('brand', (table) => {
			table.increments();
			table.string('name').notNullable();
			table.string('description');
			table.string('slug').unique().notNullable();

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable('news', (table) => {
			table.increments();
			table.text('name').notNullable();
			table.boolean('is_active').defaultTo(false);
			table.boolean('is_hot').defaultTo(false).notNullable();
			table.string('thumbnail');
			table.string('description');
			table.text('content');
			table.string('slug').notNullable().unique();

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable('collection', (table) => {
			table.increments();
			table.string('name').notNullable();
			table.string('slug').notNullable().unique();
			table.integer('thumbnail_id');
			table.specificType('product_ids', 'integer ARRAY');

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
		})
		.createTable('product', (table) => {
			table.increments();
			table.string('sku').notNullable().unique();
			table.string('title', 1024);
			table.boolean('is_featured').defaultTo(false);
			table.boolean('is_hot').defaultTo(false);

			table.float('base_price').defaultTo(0);
			table.float('price').defaultTo(0);
			table.float('sale_price').defaultTo(0);
			table.float('discount').defaultTo(0);

			table.float('review').defaultTo(5).comment('review rate for product');
			table.boolean('is_out_of_stock').defaultTo(false);
			table.integer('depot');
			table.integer('inventory');
			table.boolean('is_active').defaultTo(true);
			table.boolean('is_sale').defaultTo(false);
			table.string('slug').notNullable().unique();

			table.string('thumbnail');
			table.text('description');
			table.text('warranty');

			table.integer('brand_id').references('brand.id');
			table.integer('spec_type_id').references('spec_type.id');

			table.specificType('images', 'text ARRAY');

			table.integer('news_id').references('news.id');
			table.integer('collection_id').references('collection.id');

			table.specificType('variants', 'integer ARRAY');

			table.text('content').comment('nội dung bài viết cho sản phẩm');

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})

		.createTable('product_category', (table) => {
			table.increments();
			table.integer('product_id').references('product.id').notNullable();
			table.integer('category_id').references('category.id').notNullable();
			table.unique(['product_id', 'category_id']);
			table.boolean('is_main').defaultTo('false').notNullable();

			table.integer('created_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
		})
		.createTable('spec_name', (table) => {
			table.increments();

			table.string('name').notNullable();
			table.boolean('required').defaultTo(false);
			table.integer('spec_type_id').notNullable().references('spec_type.id');

			table.integer('position').defaultTo(1);
			table.boolean('use_filter').notNullable().defaultTo(true);

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable('spec_value', (table) => {
			table.increments();
			table.string('value').notNullable();

			table.integer('product_id').notNullable().references('product.id');
			table.integer('spec_name_id').notNullable().references('spec_name.id');

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable('cart', (table) => {
			table.increments();

			table.integer('user_id').notNullable().references('user.id');
			table.specificType('product_ids', 'integer ARRAY');
			table.boolean('is_ordered').defaultTo(false);

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
		})
		.createTable(Tables.order, (table) => {
			table.increments();
			table.integer('user_id').references('user.id'); // customer
			table.integer('cart_id').references('cart.id');
			table
				.integer('status')
				.unsigned()
				.defaultTo(1)
				.comment('0: Đợi xác nhận; 1: Xác nhận; 2: Giao hàng; 3: Nhận hàng');
			table.float('tax');
			table.float('shipping_price');
			table.float('total');
			table.string('promotion');
			table.float('discount');

			table.string('full_name');
			table.string('first_name');
			table.string('email');
			table.string('phone').notNullable();
			table.string('customer_address');
			table.string('delivery_address');
			table.string('city');
			table.string('district');

			table.boolean('same_customer_address').defaultTo(true);
			table
				.integer('payment_way')
				.unsigned()
				.defaultTo(1)
				.comment('0: at store; 1: COD; 2: tra gop');
			table
				.integer('delivery_way')
				.unsigned()
				.defaultTo(1)
				.comment('0: tới của hàng; 1: giao hàng');

			table.text('note');

			table.integer('created_by');
			table.integer('updated_by');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');
			table.integer('deleted_by');
			table.timestamp('deleted_at');
		})
		.createTable(Tables.orderItem, (table) => {
			table.increments();

			table.integer('order_id').references('order.id').notNullable();
			table.integer('product_id').references('product.id').notNullable();

			table.float('price').notNullable();
			table.float('discount');
			table.integer('quantity').unsigned().notNullable().defaultTo(1);

			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at');

			table.unique(['order_id', 'product_id']);
		})

		.then(async () => {
			const updateTables = [
				'user',
				'category',
				'brand',
				'collection',
				'product',
				'spec_type',
				'spec_name',
				'spec_value',
				'news',
				'cart',
				'order',
				'order_item',
				'image',
			];
			const asynsFuncs = Object.keys(updateTables).map(
				(key: string) => knex.raw(onUpdateTrigger((updateTables as any)[key]))
				// eslint-disable-next-line function-paren-newline
			);
			await Promise.all(asynsFuncs);
		});
};

exports.down = async (knex: Knex): Promise<void> => {
	await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');

	let tablesString = '';

	Object.keys(Tables).forEach((key: string) => {
		tablesString += `${(Tables as any)[key]},`;
	});

	return knex.raw(`DROP TABLE IF EXISTS ${tablesString.slice(0, -1)} CASCADE;`);
};
