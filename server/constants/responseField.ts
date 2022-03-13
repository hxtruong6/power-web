/* eslint-disable import/prefer-default-export */
const selectPublicProds = [
	'id',
	'sku',
	'title',
	'is_featured',
	'is_hot',
	'base_price',
	'price',
	'slug',
	'thumbnail',
	'description',
	'warranty',
	'images',
	// 'variants',
	// 'content',
];

const selectPublicMenu = ['id', 'name', 'url'];

export { selectPublicProds, selectPublicMenu };
