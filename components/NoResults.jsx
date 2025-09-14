import { Dimensions, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, TEXT_SIZES } from '../globals'

const { height: HEIGHT } = Dimensions.get('window')

const NoResults = () => (
	<View style={noResultsStyles.noResults}>
		<View style={noResultsStyles.noResultsCard}>
			<MaterialCommunityIcons name='filter-variant-remove' size={50} color={COLORS.red} />
			<Text style={noResultsStyles.noResultsText}>No se encontraron resultados</Text>
		</View>
	</View>
)

const noResultsStyles = StyleSheet.create({
	noResults: {
		paddingTop: 40,
		paddingBottom: 20,
		alignItems: 'center'
	},
	noResultsCard: {
		width: '80%',
		height: HEIGHT / 2,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		paddingHorizontal: 20,
		paddingVertical: 40,
		borderRadius: 5,
		backgroundColor: COLORS.white1
	},
	noResultsText: {
        fontSize: TEXT_SIZES.big,
        color: COLORS.mono_gray1,
		textAlign: 'center'
    }
})

export default NoResults
