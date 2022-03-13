import { Request } from 'express';

interface RequestWithUser extends Request {
	user: any;
	userId: any;
}

export default RequestWithUser;
