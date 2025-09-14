import Realm, { BSON } from 'realm'

export class GlossarySchema extends Realm.Object {
	static schema = {
		name: 'Glossary',
		properties: {
			_id: { type: 'objectId', default: () => new BSON.ObjectId() },
			word: 'string',
			definition: 'string'
		},
		primaryKey: '_id'
	}
}
