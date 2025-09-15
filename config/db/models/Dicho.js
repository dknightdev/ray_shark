import Realm, { BSON } from 'realm'

export class DichoResult extends Realm.Object {
	static schema = {
		name: "DichoResult",
		embedded: true,
		properties: {
			name: "string",
			dicho_keys: "string[]"
		}
	}
}

export class DichoOption extends Realm.Object {
	static schema = {
		name: "DichoOption",
		embedded: true,
		properties: {
			code: "string",
			text: "string",
			next: "int?",
			result: "DichoResult?"
		}
	}
}

export class DichoNode extends Realm.Object {
	static schema = {
		name: "DichoNode",
		embedded: true,
		properties: {
			id: "int",
			description: "string",
			options: "DichoOption[]"
		}
	}
}

export class DichoKeyTree extends Realm.Object {
	static schema = {
		name: "DichoKeyTree",
		properties: {
			_id: { type: "objectId", default: () => new BSON.ObjectId() },
			type: "string",              // "shark" | "ray"
			level: "string",              // "order" | "family" | "genus"
			nodes: "DichoNode[]"
		},
		primaryKey: "_id"
	}
}

export default [DichoKeyTree, DichoNode, DichoOption, DichoResult]
