import Realm, { BSON } from 'realm'

export class GendersSchema extends Realm.Object {
	static schema = {
		name: 'Genders',
		properties: {
			_id: { type: 'objectId', default: () => new BSON.ObjectId() },
			name: 'string',
			family: 'string',
			type: 'string',
			order: 'string',
			location: 'string[]'
		},
		primaryKey: '_id'
	}
}
