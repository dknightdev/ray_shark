import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native"

import { COLORS, TEXT_SIZES } from '../globals'
import { useMainStore } from "../store/mainStore"

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

const ModalDefinition = ({ data: { word, definition } }) => {
	const { hideModalDefinition } = useMainStore()

	return (
		<Modal animationType='fade' transparent={true} visible={true}>
			<View style={styles.container_background_modal}>
				<View style={styles.container}>
					<View style={styles.containerHorizontalLine}>
						<Text style={styles.textBold}>Termino: </Text>
						<Text style={styles.text}>{word}</Text>
					</View>

					<View style={styles.containerVerticalLine}>
						<Text style={[styles.textBold, { marginBottom: 2 }]}>Definición:</Text>
						<Text style={styles.text}>{definition}</Text>
					</View>

					<View style={styles.container_btn}>
						<View style={styles.content_btn}>
							<Pressable
								onPress={hideModalDefinition}
								android_ripple={{ color: COLORS.mono_medium_soft }}
								style={({ pressed }) => [
									styles.btn,
									Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
								]}
								accessibilityRole='button'
							>
								<Text style={styles.btn_text}>Cerrar</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container_background_modal: {
		width: WIDTH,
		height: HEIGHT,
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
	containerHorizontalLine: {
		alignSelf: 'flex-start',
		flexDirection: 'row'
	},
	containerVerticalLine: {
		marginTop: 5,
		marginBottom: 10
	},
	container_btn: {
		alignSelf: 'stretch',
		alignItems: 'center',
		marginTop: 5,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: COLORS.white4
	},
	content_btn: {
		borderRadius: 5,
		overflow: 'hidden'
	},
	text: {
		lineHeight: TEXT_SIZES.medium + 2,
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3
	},
	textBold: {
		lineHeight: TEXT_SIZES.medium + 2,
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		fontWeight: 'bold'
	},
	btn: {
		paddingVertical: 6,
		paddingHorizontal: 20,
		backgroundColor: COLORS.mono_dark
	},
	btn_text: {
		color: COLORS.whiteForButtons,
		fontSize: TEXT_SIZES.medium
	}
})

export default ModalDefinition
