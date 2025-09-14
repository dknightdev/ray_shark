import { useEffect } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { COLORS, TEXT_SIZES } from '../globals'
import MantaSvg from './AnchorSvgAnimated'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const ICON_SIZE = Math.min(WIDTH, HEIGHT) / 4

const Loading = () => {
	const strokeOpacity = useSharedValue(0)
	const textOpacity = useSharedValue(0.3)

	useEffect(() => {
		strokeOpacity.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1, true)
		textOpacity.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1, true)
	}, [])

	const textAnimatedStyle = useAnimatedStyle(() => ({
		opacity: textOpacity.value
	}))

	return (
		<View style={styles.container}>
			<View style={styles.container_icons}>
				<MantaSvg
					strokeColor={COLORS.primary1}
					color={COLORS.primary1_soft}
					opacityStroke={strokeOpacity}
					height={ICON_SIZE}
					width={ICON_SIZE}
				/>
				<Animated.View style={[styles.container_text, textAnimatedStyle]}>
					<Text style={styles.text}>Cargando</Text>
					<Text style={styles.dot}>.</Text>
					<Text style={styles.dot}>.</Text>
					<Text style={styles.dot}>.</Text>
				</Animated.View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.background_modal,
		zIndex: 1
	},
	container_icons: {
		height: ICON_SIZE * 1.4,
		width: ICON_SIZE * 1.4,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.white2,
		borderRadius: 10
	},
	container_text: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		color: COLORS.primary1,
		fontWeight: '500',
		fontSize: TEXT_SIZES.medium
	},
	dot: {
		color: COLORS.primary1,
		fontWeight: '900',
		fontSize: TEXT_SIZES.medium,
		marginLeft: 2
	}
})

export default Loading
