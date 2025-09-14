import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, TEXT_SIZES } from '../globals'

const { height: HEIGHT } = Dimensions.get('window')

const CustomInput = ({
	style = {},
	label = '',
	onBlur,
	value,
	onChangeText,
	onFocus,
	rightIcon,
	...rest
}) => {
	const [isFocused, setIsFocused] = useState(false)
	const [labelH, setLabelH] = useState(0)
	const [inputH, setInputH] = useState(0)

	const focusAnim = useRef(new Animated.Value(0)).current
	const inputRef = useRef(null)

	useEffect(() => {
		Animated.timing(focusAnim, {
			toValue: isFocused || !!value ? 1 : 0,
			duration: 160,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: true
		}).start()
	}, [isFocused, value])

	const { yStart, yFocused, xStart, xFocused, scaleStart, scaleFocused } = useMemo(() => {
		const hInput = inputH || HEIGHT / 18
		const hLabel = labelH || TEXT_SIZES.big

		const start = (hInput - hLabel) / 2

		const focused = -hLabel / 2 - 2

		return {
			yStart: start,
			yFocused: focused,
			xStart: 0,
			xFocused: -15,
			scaleStart: 1,
			scaleFocused: 0.75
		}
	}, [inputH, labelH])

	const animatedStyle = {
		transform: [
			{
				scale: focusAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [scaleStart, scaleFocused]
				})
			},
			{
				translateY: focusAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [yStart, yFocused]
				})
			},
			{
				translateX: focusAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [xStart, xFocused]
				})
			}
		]
	}

	return (
		<View style={[inputStyles.containerInputSearch, style]}>
			<TextInput
				{...rest}
				ref={inputRef}
				cursorColor={COLORS.mono_black2}
				maxLength={40}
				style={[
					inputStyles.inputSearch,
					{
						borderColor: isFocused ? COLORS.mono_gray1 : COLORS.white5,
						shadowColor: isFocused ? COLORS.mono_gray1 : COLORS.white5
					}
				]}
				value={value}
				onLayout={e => setInputH(e.nativeEvent.layout.height)}
				onChangeText={onChangeText}
				onBlur={e => {
					setIsFocused(false)
					onBlur && onBlur(e)
				}}
				onFocus={e => {
					setIsFocused(true)
					onFocus && onFocus(e)
				}}
			/>

			<Animated.View style={[inputStyles.labelContainer, animatedStyle]}>
				<Pressable
					onPress={() => inputRef.current?.focus()}
					accessibilityRole='button'
					android_ripple={{ color: 'transparent' }}
				>
					<Text
						onLayout={e => setLabelH(e.nativeEvent.layout.height)}
						style={[inputStyles.label, { color: isFocused ? COLORS.mono_black2 : COLORS.mono_gray1 }]}
					>
						{label || 'Buscar'}
					</Text>
				</Pressable>
			</Animated.View>

			{rightIcon && value == '' && (
				<View style={inputStyles.containerrightIcon}>
					<MaterialCommunityIcons name={rightIcon} size={TEXT_SIZES.big} color={isFocused ? COLORS.mono_black2 : COLORS.mono_gray1} />
				</View>
			)}

			{value !== '' && (
				<Pressable
					onPress={() => onChangeText('')}
					accessibilityRole='button'
					accessibilityLabel='Limpiar búsqueda'
					hitSlop={8}
					style={({ pressed }) => [
						inputStyles.containerrightIcon,
						Platform.OS === 'ios' && { opacity: pressed ? 0.6 : 1 }
					]}
					android_ripple={{ color: COLORS.ripple }}
				>
					<MaterialCommunityIcons name='close' size={TEXT_SIZES.big} color={COLORS.red} />
				</Pressable>
			)}
		</View>
	)
}

const inputStyles = StyleSheet.create({
	containerInputSearch: {
		position: 'relative',
		width: '100%'
	},
	inputSearch: {
		minHeight: 48,
		width: '100%',
		paddingHorizontal: 20,
		borderWidth: 1,
		borderRadius: 5,
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		backgroundColor: COLORS.white1,
		shadowOffset: {
			width: 0,
			height: 8
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 6,
		zIndex: 1
	},
	labelContainer: {
		position: 'absolute',
		paddingHorizontal: 10,
		left: 10,
		backgroundColor: COLORS.white1,
		zIndex: 1
	},
	label: {
		fontSize: TEXT_SIZES.big,
		lineHeight: TEXT_SIZES.big * 1
	},
	containerrightIcon: {
		position: 'absolute',
		right: 10,
		top: '50%',
		transform: [{ translateY: '-50%' }],

		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2,
		padding: 5
	}
})

export default CustomInput
