import Realm from 'realm'

export class StateConservationSchema extends Realm.Object {
	static schema = {
		name: 'StateConservation',
		properties: {
			_id: 'objectId',
			name: 'string',
			abbreviation: 'string',
			description: 'string'
		},
		primaryKey: '_id'
	}
}
