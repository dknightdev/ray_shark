import Realm, { BSON } from 'realm'

export class LocationsSchema extends Realm.Object {
	static schema = {
		name: 'Locations',
		properties: {
			_id: { type: 'objectId', default: () => new BSON.ObjectId() },
			name: 'string',
			image: 'int'
		},
		primaryKey: '_id'
	}
}
