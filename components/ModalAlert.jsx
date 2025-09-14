import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, TEXT_SIZES } from '../globals'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

const MODAL_TYPES = {
	info: {
		text: 'Información',
		icon: 'info',
		color: COLORS.blue,
		color_highlight: COLORS.blue_highlight
	},
	warning: {
		text: 'Advertencia',
		icon: 'warning',
		color: COLORS.orange,
		color_highlight: COLORS.orange_highlight
	},
	error: {
		text: 'Error',
		icon: 'error',
		color: COLORS.red,
		color_highlight: COLORS.red_highlight
	},
	success: {
		text: 'Éxito',
		icon: 'check-circle',
		color: COLORS.green,
		color_highlight: COLORS.green_highlight
	}
}

const Button = ({ variant, text, onPress, accentColor, ripple }) => {
	if (variant === 'close') {
		return (
			<View style={styles.container_btn}>
				<Pressable
					onPress={onPress}
					android_ripple={{ color: COLORS.ripple }}
					style={({ pressed }) => [
						styles.btn,
						styles.btn_close,
						Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
					]}
					accessibilityRole='button'
				>
					<Text style={styles.btn_close_text}>{text}</Text>
				</Pressable>
			</View>
		)
	}
	if (variant === 'secondary') {
		return (
			<View style={styles.container_btn}>
				<Pressable
					onPress={onPress}
					android_ripple={{ color: COLORS.ripple }}
					style={({ pressed }) => [
						styles.btn,
						styles.btn_secondary,
						Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
					]}
					accessibilityRole='button'
				>
					<Text style={styles.btn_secondary_text}>{text}</Text>
				</Pressable>
			</View>
		)
	}
	if (variant === 'primary') {
		return (
			<View style={styles.container_btn}>
				<Pressable
					onPress={onPress}
					android_ripple={{ color: ripple, borderless: false }}
					style={({ pressed }) => [
						styles.btn,
						{ backgroundColor: accentColor },
						Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
					]}
					accessibilityRole='button'
				>
					<Text style={[styles.btn_primary_text, { color: COLORS.white1 }]}>{text}</Text>
				</Pressable>
			</View>
		)
	}
	return null
}

const ModalAlert = ({ data: { type = 'info', title = '', message = '', buttons = [] } }) => {
	const { text, icon, color, color_highlight } = MODAL_TYPES[type] || MODAL_TYPES.info

	return (
		<Modal animationType='fade' transparent={true} visible={true}>
			<View style={styles.container_background_modal}>
				<View style={styles.container}>
					<MaterialIcons name={icon} size={TEXT_SIZES.icon_big} color={color} />
					<Text style={styles.title}>{title || text}</Text>
					<Text style={styles.message}>{message}</Text>

					<View style={styles.container_buttons}>
						{buttons.map(({ type, text, onPress }, i) => (
							<Button
								key={i}
								variant={type}
								text={text}
								onPress={onPress}
								accentColor={color}
								ripple={color_highlight}
							/>
						))}
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container_background_modal: {
		width: WIDTH, height: HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.background_modal
	},
	container: {
		maxWidth: WIDTH * 0.8,
		minWidth: WIDTH * 0.55,
		minHeight: HEIGHT * 0.15,
		maxHeight: HEIGHT * 0.6,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.white2,
		overflow: 'hidden',
		borderRadius: 10,
		padding: 15
	},
	container_buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
		gap: 12
	},
	title: {
		fontSize: TEXT_SIZES.big,
		fontWeight: '900',
		color: COLORS.mono_black3,
		marginBottom: 5
	},
	message: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		textAlign: 'center',
		marginTop: 5,
		marginBottom: 15,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.white4
	},
	container_btn: {
		borderRadius: 5,
		overflow: 'hidden'
	},
	btn: {
		paddingVertical: 5,
		paddingHorizontal: 15
	},
	btn_close: {
		backgroundColor: COLORS.white5
	},
	btn_secondary: {
		borderWidth: 1,
		borderColor: COLORS.mono_gray1
	},
	btn_close_text: {
		color: COLORS.white1,
		fontSize: TEXT_SIZES.medium
	},
	btn_secondary_text: {
		color: COLORS.mono_gray1,
		fontSize: TEXT_SIZES.medium
	},
	btn_primary_text: {
		fontSize: TEXT_SIZES.medium
	}
})

export default ModalAlert
