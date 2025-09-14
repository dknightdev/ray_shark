import { Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { COLORS, TEXT_SIZES } from '../globals'
import { useMainStore } from "../store/mainStore"
import { getStatusColor } from "../utils/utilities"

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

const ModalStateConservation = ({ data: { states } }) => {
	const { hideModalStateConservation } = useMainStore()

	return (
		<Modal animationType='fade' transparent={true} visible={true}>
			<View style={styles.container_background_modal}>
				<View style={styles.container}>
					<Text style={styles.textTitle}>Estados de Conservación</Text>
					<ScrollView style={styles.listaStatesConserv}>
						{states.map(({name = '', abbreviation = '', description = ''}, i) => (
							<View key={i} style={{ marginBottom: 15, gap: 2 }}>
								<Text style={styles.textBold}><MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.small} color={getStatusColor(abbreviation)} /> {name} ({abbreviation}):</Text>
								<Text style={styles.text}>{description}</Text>
							</View>
						))}
					</ScrollView>

					<View style={styles.container_btn}>
						<View style={styles.content_btn}>
							<Pressable
								onPress={hideModalStateConservation}
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
		maxWidth: WIDTH * 0.9,
		minWidth: WIDTH * 0.55,
		minHeight: HEIGHT * 0.15,
		maxHeight: HEIGHT * 0.7,
		justifyContent: 'center',
		backgroundColor: COLORS.white2,
		overflow: 'hidden',
		borderRadius: 10,
		padding: 15
	},
	listaStatesConserv: {
		marginBottom: 10,
		paddingVertical: 5
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
	textTitle: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_black2,
		fontWeight: '500',
		marginBottom: 10,
		textAlign: 'center'
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

export default ModalStateConservation
