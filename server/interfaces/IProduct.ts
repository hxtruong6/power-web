interface IProductCreate {
	id?: string;
	specTypeId: string;
	title: string;
	slug: string;
	sku: string;
}

interface IProductSetSpecType {
	productId: string;
	specTypeId: string;
}

export { IProductCreate, IProductSetSpecType };
