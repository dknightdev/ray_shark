import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { COLORS, TEXT_SIZES } from '../globals'
import MantaSvg from "./AnchorSvgAnimated"

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const ICON_SIZE = Math.min(WIDTH, HEIGHT) / 14

const ModalDefineType = ({ handleSelect, handleClose, visible }) => {
	return (
		<Modal animationType='fade' transparent={true} visible={visible}>
			<View style={styles.container_background_modal}>
				<View style={styles.container}>
					<Text style={styles.textQuestion}>¿Qué tipo de animal deseas identificar?</Text>

					<View style={styles.containerOptionsBtns}>
						<View style={styles.containerBtn}>
							<Pressable
								style={({ pressed }) => [
									styles.btn,
									Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
								]}
								onPress={() => handleSelect('shark')}
								android_ripple={{ color: COLORS.mono_medium_soft }}
								accessibilityRole='button'
							>
								<MaterialCommunityIcons name='shark' size={ICON_SIZE} color={COLORS.whiteForButtons} />
								<Text style={styles.textBtn}>Tiburón</Text>
							</Pressable>
						</View>

						<View style={styles.containerBtn}>
							<Pressable
								style={({ pressed }) => [
									styles.btn,
									Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
								]}
								onPress={() => handleSelect('ray')}
								android_ripple={{ color: COLORS.mono_medium_soft }}
								accessibilityRole='button'
							>
								<MantaSvg
									strokeColor={COLORS.whiteForButtons}
									color={COLORS.whiteForButtons}
									height={ICON_SIZE}
									width={ICON_SIZE}
								/>
								<Text style={styles.textBtn}>Raya</Text>
							</Pressable>
						</View>
					</View>

					<View style={styles.containerCloseBtn}>
						<View style={styles.containerBtn}>
							<Pressable
								style={({ pressed }) => [
									styles.btnClose,
									Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
								]}
								onPress={handleClose}
								android_ripple={{ color: COLORS.ripple }}
								accessibilityRole='button'
							>
								<Text style={styles.textClose}>Cancelar</Text>
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
	textQuestion: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_black3,
		textAlign: 'center',
		fontWeight: '500'
	},
	containerOptionsBtns: {
		width: '100%',
		flexDirection: 'row',
		gap: 30,
		paddingTop: 20,
		paddingBottom: 25,
	},
	containerCloseBtn: {
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: COLORS.white4
	},
	containerBtn: {
		borderRadius: 5,
		overflow: 'hidden'
	},
	btn: {
		minWidth: WIDTH * 0.25,
		minHeight: 60,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 5,
		paddingHorizontal: 25,
		backgroundColor: COLORS.mono_dark
	},
	textBtn: {
		color: COLORS.whiteForButtons,
		fontSize: TEXT_SIZES.medium
	},
	btnClose: {
		paddingVertical: 6,
		paddingHorizontal: 20,
		backgroundColor: COLORS.white4
	},
	textClose: {
		color: COLORS.mono_gray1,
		fontSize: TEXT_SIZES.medium
	}
})

export default ModalDefineType
