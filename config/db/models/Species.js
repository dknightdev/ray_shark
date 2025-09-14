import Realm, { BSON } from 'realm'

export class SpeciesSchema extends Realm.Object {
	static schema = {
		name: 'Species',
		properties: {
			_id: { type: 'objectId', default: () => new BSON.ObjectId() },
			name: 'string',
			common_name: 'string',
			habitat: 'string',
			marine_habitat: 'string',
			description: 'string',
			size: 'int',
			age: 'int',
			diet: 'string[]',
			repro_char: 'string',
			depth_min: 'int',
			depth_max: 'int',
			type: 'string',
			gender: 'string',
			family: 'string',
			order: 'string',
			state: 'string',
			location: 'string[]',
			image: 'string',
			image_location: 'string'
		},
		primaryKey: '_id'
	}
}
