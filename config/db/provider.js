import 'react-native-get-random-values'

import { createContext, useContext, useEffect, useState } from 'react'
import Realm, { BSON } from 'realm'

import { useMainStore } from '../../store/mainStore'

import DichoSchemas from './models/Dicho'
import { FamiliesSchema } from "./models/Families"
import { GendersSchema } from "./models/Genders"
import { GlossarySchema } from "./models/Glossary"
import { LocationsSchema } from "./models/Locations"
import { OrdersSchema } from "./models/Orders"
import { SpeciesSchema } from "./models/Species"
import { StateConservationSchema } from './models/StateConservation'
import { TypesSchema } from "./models/Types"

import FamiliesData from "../../assets/json/families.json"
import GendersData from "../../assets/json/genders.json"
import GlossaryData from "../../assets/json/glossary.json"
import LocationsData from "../../assets/json/locations.json"
import OrdersData from "../../assets/json/orders.json"
import SpeciesData from "../../assets/json/species.json"
import StateConservationData from '../../assets/json/state_conservation.json'
import TypesData from "../../assets/json/types.json"

import DichoKeyOrderRay from "../../assets/json/dicho_key_order_ray.json"
import DichoKeyOrderShark from "../../assets/json/dicho_key_order_shark.json"

const RealmContext = createContext()

const realmConfig = {
	schema: [
		...DichoSchemas,
		LocationsSchema,
		TypesSchema,
		OrdersSchema,
		FamiliesSchema,
		GendersSchema,
		SpeciesSchema,
		GlossarySchema,
		StateConservationSchema
	],
	schemaVersion: 4
}

export const RealmProvider = ({ children }) => {
	const [realm, setRealm] = useState(null)
	const { setLoading } = useMainStore()

	const loadInitialData = (realmInstance) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				realmInstance.write(() => {
					realmInstance.create('DichoKeyTree', {
						_id: new BSON.ObjectId(),
						type: "shark",
						level: "order",
						nodes: DichoKeyOrderShark
					})

					realmInstance.create('DichoKeyTree', {
						_id: new BSON.ObjectId(),
						type: "ray",
						level: "order",
						nodes: DichoKeyOrderRay
					})

					LocationsData.forEach(item => {
						realmInstance.create('Locations', {
							_id: new BSON.ObjectId(),
							...item
						})
					})

					GlossaryData.forEach(item => {
						realmInstance.create('Glossary', {
							_id: new BSON.ObjectId(),
							...item
						})
					})

					TypesData.forEach(item => {
						realmInstance.create('Types', {
							_id: new BSON.ObjectId(),
							...item
						})
					})

					StateConservationData.forEach(item => {
						realmInstance.create('StateConservation', {
							_id: new BSON.ObjectId(),
							...item
						})
					})

					OrdersData.forEach(item => {
						realmInstance.create('Orders', {
							_id: new BSON.ObjectId(),
							...item
						})
					})

					FamiliesData.forEach(item => {
						realmInstance.create('Families', {
							_id: new BSON.ObjectId(),
							...item
						})
					})

					GendersData.forEach(item => {
						realmInstance.create('Genders', {
							_id: new BSON.ObjectId(),
							...item
						})
					})

					SpeciesData.forEach(item => {
						realmInstance.create('Species', {
							_id: new BSON.ObjectId(),
							...item
						})
					})
				})

				setLoading(false)
				resolve()
			}, 0)
		})
	}

	useEffect(() => {
		const openRealm = async () => {
			/* para pruebas vamos a eliminar todos los datos simepre al entrar y recargar los json */
			Realm.deleteFile(realmConfig)


			const realmInstance = await Realm.open(realmConfig)

			const speciesCount = realmInstance.objects('Species').length

			if (speciesCount === 0) {
				setLoading(true)
				await loadInitialData(realmInstance)
			} else {
				setLoading(false)
			}

			setRealm(realmInstance)
		}

		openRealm()

		return () => {
			if (realm) {
				realm.close()
				setRealm(null)
			}
		}
	}, [])

	return (
		<RealmContext.Provider value={realm}>
			{children}
		</RealmContext.Provider>
	)
}

export const useRealm = () => {
	return useContext(RealmContext)
}

export default RealmProvider
