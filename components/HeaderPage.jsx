import { useRouter } from 'expo-router'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, TEXT_SIZES } from '../globals'

const HeaderPage = () => {
	const router = useRouter()

	return (
		<View style={styles.containerHeader}>
			<View style={styles.containerHeaderBtn}>
				<Pressable
					style={({ pressed }) => [
						styles.buttonBack,
						Platform.OS === 'ios' && { opacity: pressed ? 0.6 : 1 }
					]}
					onPress={() => router.back()}
					android_ripple={{ color: COLORS.ripple }}
					accessibilityRole='button'
				>
					<MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.mono_black3} />
				</Pressable>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	containerHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingInline: 5,
		paddingTop: 5,
		backgroundColor: COLORS.white1
	},
	title: {
		flex: 1,
		fontStyle: 'italic',
		fontWeight: '500',
		fontSize: TEXT_SIZES.veryBig,
		color: COLORS.text
	},
	containerHeaderBtn: {
		borderRadius: 50,
		overflow: 'hidden',
		marginRight: 5
	},
	buttonBack: {
		padding: 10
	}
})

export default HeaderPage
