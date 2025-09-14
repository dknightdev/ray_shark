import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native"
import { COLORS, TEXT_SIZES } from "../globals"

const { height: HEIGHT } = Dimensions.get("window")

const SearchLoading = () => (
	<View style={searchLoadingStyles.searchLoading}>
		<View style={searchLoadingStyles.searchLoadingCard}>
			<ActivityIndicator size={50} color={COLORS.primary1} />
			<Text style={searchLoadingStyles.noResultsText}>Buscando...</Text>
		</View>
	</View>
)

const searchLoadingStyles = StyleSheet.create({
	searchLoading: {
		paddingTop: 40,
		paddingBottom: 20,
		alignItems: "center"
	},
	searchLoadingCard: {
		width: "80%",
		height: HEIGHT / 2,
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		paddingHorizontal: 20,
		paddingVertical: 40,
		borderRadius: 5,
		backgroundColor: COLORS.white1
	},
	noResultsText: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_gray1,
		textAlign: "center"
	}
})

export default SearchLoading
