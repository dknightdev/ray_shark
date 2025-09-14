import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store"
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const INITIAL_ALERT_STATE = {
	show: false,
	type: '',
	message: '',
	buttons: []
}

const INITIAL_MODAL_DEFINITION_STATE = {
	show: false,
	word: '',
	definition: ''
}

const INITIAL_MODAL_STATE_CONSERVATION = {
	show: false,
	states: []
}

const INITIAL_FILTER_DATA = {
	location: [],
	order: '',
	family: '',
	gender: ''
}


const SecureStorage = {
	getItem: async (name) => {
	  	return (await getItemAsync(name)) || null
	},
	setItem: async (name, value) => {
	  	await setItemAsync(name, value)
	},
	removeItem: async (name) => {
	  	await deleteItemAsync(name)
	},
}

export const useMainPersistStore = create(persist(
	(set) => ({
		showInitialPage: true,
		setSeenInitialPage: () => set({ showInitialPage: false })
	}),
	{
		name: 'main-persist-store',
		storage: createJSONStorage(() => SecureStorage)
	}
))

export const useMainStore = create((set) => ({
	loading: false,
	setLoading: (value) => set({ loading: value }),

	alert: INITIAL_ALERT_STATE,
	showAlert: ({ type, title, message, buttons }) => set({
		alert: { show: true, type, title, message, buttons }
	}),
	hideAlert: () => set({ alert: INITIAL_ALERT_STATE }),

	modalDefinition: INITIAL_MODAL_DEFINITION_STATE,
	showModalDefinition: ({ word, definition }) => set({
		modalDefinition: { show: true, word, definition }
	}),
	hideModalDefinition: () => set({ modalDefinition: INITIAL_MODAL_DEFINITION_STATE }),

	modalStateConservation: INITIAL_MODAL_STATE_CONSERVATION,
	showModalStateConservation: ({ states }) => set({
		modalStateConservation: { show: true, states }
	}),
	hideModalStateConservation: () => set({ modalStateConservation: INITIAL_MODAL_STATE_CONSERVATION }),

	filterData: INITIAL_FILTER_DATA,
	setFilterData: (data) => set((state) => ({ filterData: { ...state.filterData, ...data } })),
	resetFilterData: () => set({ filterData: INITIAL_FILTER_DATA })
}))
