import Realm, { BSON } from 'realm'

export class OrdersSchema extends Realm.Object {
	static schema = {
		name: 'Orders',
		properties: {
			_id: { type: 'objectId', default: () => new BSON.ObjectId() },
			name: 'string',
			type: 'string',
			location: 'string[]',
      		dicho_keys: 'string[]'
		},
		primaryKey: '_id'
	}
}
