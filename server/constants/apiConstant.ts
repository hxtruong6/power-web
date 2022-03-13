const ApiCode = {
	Ok: 200,
	Created: 201,

	BadRequest: 400,
	Unauthorized: 401,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405,

	InternalServerError: 500,
	ServiceUavailable: 503,
};

const ApiStatus = {
	Success: 'success',
	Fail: 'fail',
	Error: 'error',
};

const ApiMethod = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

export { ApiCode, ApiStatus, ApiMethod };
