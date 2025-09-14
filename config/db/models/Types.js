import Realm, { BSON } from 'realm'

export class TypesSchema extends Realm.Object {
	static schema = {
		name: 'Types',
		properties: {
			_id: { type: 'objectId', default: () => new BSON.ObjectId() },
			name: 'string'
		},
		primaryKey: '_id'
	}
}
