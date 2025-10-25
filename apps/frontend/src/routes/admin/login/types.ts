export type LoginResponse = LoginSuccess | LoginError;

type LoginSuccess = {
	success: true;
    message: string;
	user: {
		id: number;
		name: string;
	};
};

type LoginError = {
	success: false;
	message: string;
	user: undefined;
};
