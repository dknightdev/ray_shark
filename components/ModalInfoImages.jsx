import { useMemo, useState } from "react"
import { Modal, Platform, Pressable, Image as RNImage, Text, View } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import ImageViewer from "react-native-image-zoom-viewer"

import { getSpeciesImage } from "../config/imageLoader/Species"
import { COLORS, TEXT_SIZES } from "../globals"

const slidesShark = [
	{ key: 's1', title: 'Parte superior de un tiburón', image: getSpeciesImage(1) },
	{ key: 's2', title: 'Parte lateral de un tiburón', image: getSpeciesImage(1) }
]

const slidesRay = [
	{ key: 'r1', title: 'Parte superior de una raya', image: getSpeciesImage(1) },
	{ key: 'r2', title: 'Parte lateral de una raya', image: getSpeciesImage(1) }
]

const ModalInfoImages = ({ handleClose, visible, type = 'shark' }) => {
	const [viewerIndex, setViewerIndex] = useState(0)

	const slides = useMemo(() => {
		if (type === 'shark') return slidesShark
		if (type === 'ray') return slidesRay
		return []
	}, [type])

	const imageUrls = useMemo(() => {
		return slides.map(s => {
			const src = RNImage.resolveAssetSource(s.image)
			return { url: src?.uri || '' }
		})
	}, [slides])

	return (
		<Modal visible={visible} transparent onRequestClose={handleClose}>
			<ImageViewer
				imageUrls={imageUrls}
				index={viewerIndex}
				onChange={setViewerIndex}
				enableSwipeDown
				onSwipeDown={handleClose}
				saveToLocalByLongPress={false}
				renderHeader={() => (
					<Pressable
						onPress={handleClose}
						style={({ pressed }) => [{ position: 'absolute', top: 20, right: 20, zIndex: 1 }, Platform.OS === 'ios' && { opacity: pressed ? 0.85 : 1 }]}
						android_ripple={{ color: COLORS.ripple }}
						accessibilityRole='button'
					>
						<MaterialCommunityIcons name='window-close' size={30} color={COLORS.white1} />
					</Pressable>
				)}
				renderFooter={() => (
					<View style={{ paddingBottom: 40, paddingHorizontal: 30 }}>
						<Text style={{ color: COLORS.white2, fontWeight: '500', fontSize: TEXT_SIZES.medium }}>
							{slides[viewerIndex]?.title || ''}
						</Text>
					</View>
				)}
				backgroundColor={COLORS.mono_black1}
			/>
		</Modal>
	)
}

export default ModalInfoImages
