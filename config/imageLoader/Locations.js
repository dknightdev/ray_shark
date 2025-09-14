import { Asset } from 'expo-asset'

const LOCATION_IMAGES  = {
	1: require('../../assets/images/locations/pacifico.png'),
	2: require('../../assets/images/locations/caribe.png'),
}

export const getLocationImage = id => LOCATION_IMAGES[id] || null

export const preloadLocationImages = async () => {
	const modules = Object.values(LOCATION_IMAGES)
	await Promise.all(modules.map(m => Asset.fromModule(m).downloadAsync()))
}
