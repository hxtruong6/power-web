interface ISpecPartGetAll {
	specTypeId: string;
}

interface ISpecPartCreate {
	name: string;
	specTypeId: string;
	position: number,
	required?: boolean,
}

interface ISpecPartUpdate {
	id: string;
	name?: string;
	required?: boolean;
	position?: number;
	[x: string]: any;
}

interface ISpecPartDelete {
	id: string;
}

export { ISpecPartGetAll, ISpecPartCreate, ISpecPartUpdate, ISpecPartDelete };
