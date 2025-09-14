import Realm, { BSON } from 'realm'

export class FamiliesSchema extends Realm.Object {
	static schema = {
		name: 'Families',
		properties: {
			_id: { type: 'objectId', default: () => new BSON.ObjectId() },
			name: 'string',
			type: 'string',
			order: 'string',
			location: 'string[]'
		},
		primaryKey: '_id'
	}
}
