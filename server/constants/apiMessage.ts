/* eslint-disable max-classes-per-file */
class CommonMessage {
	public NOT_FOUND: string = 'Not found';

	public BAD_REQUEST: string = 'Bad request';

	public INTERNAL_ERROR: string = 'Interal server error';

	public MISSING_ID: string = 'Missing ID in request';

	public MISSING_NAME: string = 'Missing Name in request';

	public MISSING_URL: string = 'Missing URL in request';

	public INVALID_ID: string = 'Invalid ID';

	public INVALID_REQUEST: string = 'Invalid request';

	public ROUTE_NOT_FOUND: string = 'Api not found';

	public GET_FAILED: string = 'Geet failed!';

	public CREATE_FAILED: string = 'Create failed!';

	public UPDATE_FAILED: string = 'Update failed!';

	public DELETE_FAILED: string = 'Delete failed!';
}

class AuthMessage {
	public MISSING_TOKEN: string = 'Missing token';

	public INVALID_TOKEN: string = 'Wrong Token or Token expired ';

	public TOKEN_EXPIRE: string = 'Token is expired';
}

class ProductMessage {
	public MISSING_PRODUCT_CATEGORY_ID: string = 'Missing product or category ID';

	public MISSING_SPEC_TYPE_ID: string = 'Missing product or specType ID';
}

class MenuMessage extends CommonMessage {
	// public DELETE_FAILED: string = 'Delete menu failed';
}

class UserMessage extends CommonMessage {
	public WRONG_PASSWORD: string = 'Wrong password';

	public INVALID_USER: string = 'Invalid user';

	public EMAIL_NOT_FOUND: string = 'Email not found';

	public EXIST_EMAIL: string = 'Exist email. Try with other email';
}

class SpecTypeMessage extends CommonMessage {
	public MISSING_ID_IN_GET_WITH_PARTS: string = 'Missing id when call api get part of spec type';
}

class SpecPartMessage extends CommonMessage {
	public MISSING_SPEC_TYPE_ID: string = 'Missing spec type id';
}

class SpecValueMessage {
	public MISSING_PRODUCT_ID: string = 'Missing product id';
}

const ApiMessage = new CommonMessage();
const ProductApiMessage = new ProductMessage();
const MenuApiMessage = new MenuMessage();
const UserApiMessage = new UserMessage();
const AuthApiMessage = new AuthMessage();

class ApiMessages {
	Common = new CommonMessage();

	Product = new ProductMessage();

	Menu = new MenuMessage();

	User = new UserMessage();

	Auth = new AuthMessage();

	SpecType = new SpecTypeMessage();

	SpecPart = new SpecPartMessage();

	SpecValue = new SpecValueMessage();
}

export { ApiMessage, ProductApiMessage, MenuApiMessage, UserApiMessage, AuthApiMessage };
export default new ApiMessages();
