import { Animated, Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { COLORS, TEXT_SIZES } from '../globals'
import { useMainStore } from '../store/mainStore'
import MantaSvg from './AnchorSvgAnimated'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const ICON_SIZE = Math.min(WIDTH, HEIGHT) / 4.5

const CustomTabBar = ({ state, navigation }) => {
	const router = useRouter()
	const { showAlert, hideAlert } = useMainStore()

	const opacityStrokeAnimated = new Animated.Value(0)

	const navigateTo = routeName => {
		const event = navigation.emit({ type: 'tabPress', target: routeName, canPreventDefault: true })
		if (!event.defaultPrevented) router.replace(`/(tabs)/${routeName}`)
	}

	const handleShowAlert = () => {
		showAlert({
			type: 'info',
			message: 'Este es una mensaje para dar información al usuario acerca de que trata y como usar la aplicación.',
			buttons: [
				{ type: 'primary', text: 'Aceptar', onPress: hideAlert }
			]
		})
	}

	const isFocused = idx => state.index === idx

	return (
		<View style={styles.tabBar}>
			<View style={styles.containerTab}>
				<Pressable
					accessibilityRole='button'
					accessibilityState={isFocused(0) ? { selected: true } : {}}
					accessibilityLabel='Glosario'
					onPress={() => navigateTo('glossary')}
					style={({ pressed }) => [
						styles.tab,
						Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
					]}
					android_ripple={{ color: COLORS.primary1_soft1 }}
				>
					<MaterialCommunityIcons
						name={isFocused(0) ? 'book-open-page-variant' : 'book-open-page-variant-outline'}
						size={24}
						color={isFocused(0) ? COLORS.primary1 : COLORS.mono_medium}
					/>
					<Text style={isFocused(0) ? styles.tabLabelFocused : styles.tabLabel}>Glosario</Text>
				</Pressable>
			</View>

			<View style={styles.containerTab}>
				<Pressable
					accessibilityRole='button'
					accessibilityState={isFocused(1) ? { selected: true } : {}}
					accessibilityLabel='Buscar'
					onPress={() => navigateTo('search')}
					style={({ pressed }) => [
						styles.tab,
						Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
					]}
					android_ripple={{ color: COLORS.primary1_soft1 }}
				>
					<MaterialCommunityIcons
						name={isFocused(1) ? 'layers-search' : 'layers-search-outline'}
						size={24}
						color={isFocused(1) ? COLORS.primary1 : COLORS.mono_medium}
					/>
					<Text style={isFocused(1) ? styles.tabLabelFocused : styles.tabLabel}>Buscar</Text>
				</Pressable>
			</View>

			<View style={styles.containerTab}>
				<Pressable
					accessibilityRole='button'
					accessibilityState={isFocused(2) ? { selected: true } : {}}
					accessibilityLabel='Identificar'
					onPress={() => navigateTo('identify')}
					style={({ pressed }) => [
						styles.tab,
						Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
					]}
					android_ripple={{ color: COLORS.primary1_soft1 }}
				>
					<MaterialCommunityIcons
						name={isFocused(2) ? 'feature-search' : 'feature-search-outline'}
						size={24}
						color={isFocused(2) ? COLORS.primary1 : COLORS.mono_medium}
					/>
					<Text style={isFocused(2) ? styles.tabLabelFocused : styles.tabLabel}>Identificar</Text>
				</Pressable>
			</View>


			<Pressable
				accessibilityRole='button'
				accessibilityLabel='Info'
				onPress={handleShowAlert}
				style={({ pressed }) => [
					styles.tabCenter,
					Platform.OS === 'ios' && { opacity: pressed ? 0.9 : 1 }
				]}
				android_ripple={{ color: COLORS.ripple, borderless: true }}
			>
				<View style={styles.svgContainer}>
					<MantaSvg
						style={{ transform: [{ rotate: '-30deg' }] }}
						strokeColor={COLORS.primary1}
						color={COLORS.primary1}
						opacityStroke={opacityStrokeAnimated}
						height={ICON_SIZE}
						width={ICON_SIZE}
					/>
				</View>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	tabBar: {
		position: 'absolute',
		flexDirection: 'row',
		bottom: 15,
		left: 20,
		right: 20,
		borderRadius: 20,
		height: 70,
		backgroundColor: COLORS.mono_dark
	},
	containerTab: {
		flex: 2,
		overflow: 'hidden',
		borderRadius: 20
	},
	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	tabCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	svgContainer: {
		position: 'absolute',
		bottom: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	tabLabel: {
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_medium
	},
	tabLabelFocused: {
		fontSize: TEXT_SIZES.small,
		color: COLORS.primary1
	}
})

export default CustomTabBar
