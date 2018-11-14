declare module 'ps-js' {
	import { EventEmitter } from 'events';

	export const version: string;

	// Classes

	export class BaseClient extends EventEmitter {
		constructor(options?: ClientOptions);
		private _timeouts: Set<NodeJS.Timer>;
		private _intervals: Set<NodeJS.Timer>;
		private _immediates: Set<NodeJS.Immediate>;

		public options: ClientOptions;
	}

	export class Client extends BaseClient {
		constructor(options?: ClientOptions);
	}

	export class SocketHandler {
		constructor(client: Client);
	}

	// Types

	type ClientOptions = {
		server: string,
		loginServer: string,
		autoJoinRooms: string[],
		ws: {
			secure: boolean
		},
		http: {
			secure: boolean
		}
	};
}
