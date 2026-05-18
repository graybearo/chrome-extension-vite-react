export type Messages = {
	GET_STATE: { input: void; output: { count: number; lastUpdated: number } };
	INCREMENT: { input: { by: number }; output: { count: number } };
	PING: { input: void; output: { pong: true; from: string } };
};