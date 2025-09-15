import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, Modal, Platform, Pressable, Image as RNImage, ScrollView, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import ImageViewer from 'react-native-image-zoom-viewer'

import { useIsFocused } from '@react-navigation/native'
import ModalDefineType from '../../components/ModalDefineType'
import { getSpeciesImage } from '../../config/imageLoader/Species'
import { COLORS, TEXT_SIZES } from '../../globals'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const CARD_W = WIDTH - 38
const CARD_H = Math.min(HEIGHT * 0.3, 200)

const slidesShark = [
	{ key: 's1', title: 'Parte superior de un tiburón', image: getSpeciesImage(1) },
	{ key: 's2', title: 'Parte lateral de un tiburón', image: getSpeciesImage(1) }
]

const slidesRay = [
	{ key: 'r1', title: 'Parte superior de una raya', image: getSpeciesImage(1) },
	{ key: 'r2', title: 'Parte lateral de una raya', image: getSpeciesImage(1) }
]

export default function Identify() {
	const router = useRouter()

	const [indexShark, setIndexShark] = useState(0)
	const [indexRay, setIndexRay] = useState(0)
	const listRefShark = useRef(null)
	const listRefRay = useRef(null)

	const [showModalType, setShowModalType] = useState(false)
	const [viewerVisible, setViewerVisible] = useState(false)
	const [viewerIndex, setViewerIndex] = useState(0)

	const [ctaLayout, setCtaLayout] = useState({ y: 0, h: 0 })
	const [scrollState, setScrollState] = useState({ y: 0, h: 0, contentH: 0 })
	const isCtaVisible = scrollState.y <= ctaLayout.y &&
						(scrollState.y + scrollState.h) >= (ctaLayout.y + Math.min(24, ctaLayout.h/2))
	const showFab = !isCtaVisible
	const fabAnim = useRef(new Animated.Value(0)).current
	const isFocused = useIsFocused()

	const slides = useMemo(() => [...slidesShark, ...slidesRay], [])
	const imageUrls = useMemo(() => {
		return slides.map(s => {
			const src = RNImage.resolveAssetSource(s.image)
			return { url: src?.uri || '' }
		})
	}, [slides])

	const openViewer = useCallback((absoluteIndex) => {
		setViewerIndex(absoluteIndex)
		setViewerVisible(true)
	}, [])

	const onViewableItemsChangedShark = useRef(({ viewableItems }) => {
		if (viewableItems?.length > 0) {
			const i = viewableItems[0].index ?? 0
			setIndexShark(i)
		}
	}).current

	const onViewableItemsChangedRay = useRef(({ viewableItems }) => {
		if (viewableItems?.length > 0) {
			const i = viewableItems[0].index ?? 0
			setIndexRay(i)
		}
	}).current

	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 60
	}).current

	const renderItemShark = useCallback(({ item, index }) => {
		return (
			<View style={styles.card}>
				<Pressable
					onPress={() => openViewer(index)}
					style={({ pressed }) => Platform.OS === 'ios' ? { opacity: pressed ? 0.9 : 1 } : null}
					android_ripple={{ color: COLORS.ripple }}
					accessibilityRole='imagebutton'
				>
					<Image source={item.image} style={styles.image} contentFit='cover' transition={120} />
				</Pressable>
				<Text style={styles.textCard}>{item.title}</Text>
			</View>
		)
	}, [openViewer])

	const renderItemRay = useCallback(({ item, index }) => {
		const absoluteIndex = slidesShark.length + index
		return (
			<View style={styles.card}>
				<Pressable
					onPress={() => openViewer(absoluteIndex)}
					style={({ pressed }) => Platform.OS === 'ios' ? { opacity: pressed ? 0.9 : 1 } : null}
					android_ripple={{ color: COLORS.ripple }}
					accessibilityRole='imagebutton'
				>
					<Image source={item.image} style={styles.image} contentFit='cover' transition={120} />
				</Pressable>
				<Text style={styles.textCard}>{item.title}</Text>
			</View>
		)
	}, [openViewer])

	const keyExtractor = useCallback(item => item.key, [])

	const handleStart = () => {
		setShowModalType(true)
	}

	const handleSelect = (type) => {
		setShowModalType(false)
		router.push(`/identifyFlow?type=${type}`)
	}

	const onScroll = useCallback((e) => {
		const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent
		setScrollState({
			y: contentOffset.y,
			h: layoutMeasurement.height,
			contentH: contentSize.height
		})
	}, [])

	useEffect(() => {
		if (!isFocused) return
		fabAnim.setValue(0)
		Animated.spring(fabAnim, {
			toValue: showFab ? 1 : 0,
			useNativeDriver: true,
			friction: 7,
			tension: 80
		}).start()
	}, [isFocused])

	useEffect(() => {
		Animated.spring(fabAnim, {
			toValue: showFab ? 1 : 0,
			useNativeDriver: true,
			friction: 7,
			tension: 80,
		}).start()
	}, [showFab])

	const fabStyle = {
		opacity: fabAnim,
			transform: [
			{
				translateX: fabAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [25, 0]
				})
			},
			{
				scale: fabAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [0.9, 1]
				})
			}
		]
	}

	return (
		<View style={styles.root}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				onScroll={onScroll}
				scrollEventThrottle={16}
			>
				<Text style={styles.header}>Identificación taxonómica mediante clave dicotómica</Text>
				<Text style={styles.subheader}>Antes de empezar aprende cómo funciona y comienza cuando estés listo</Text>

				<View style={styles.section1}>
					<Text style={styles.title}>¿Qué es una clave dicotómica?</Text>
					<Text style={styles.text}>
						Una clave dicotómica es una herramienta que permite identificar organismos vivos, como plantas y animales, mediante una serie de preguntas con dos opciones cada una. Al responder a estas preguntas, se va reduciendo el número de posibles especies hasta llegar a la identificación correcta.
					</Text>
				</View>

				<View style={styles.section2}>
					<Text style={styles.title}>Cobertura</Text>
					<Text style={styles.text}>
						Actualmente, la clave dicotómica cubre todas las especies de tiburones y rayas que se encuentran en aguas colombianas. Con esta herramienta, podrás identificar el orden, familia y género de cada especie que se encuentre en esta región.
					</Text>
				</View>

				<Text style={styles.title}>Te ayudamos a identificar especies</Text>
				<Text style={styles.text}>
					Utilizamos imágenes y descripciones detalladas para facilitar la identificación de especies. A continuación, te mostramos algunos ejemplos.
				</Text>

				<FlatList
					ref={listRefShark}
					data={slidesShark}
					keyExtractor={keyExtractor}
					renderItem={renderItemShark}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					snapToAlignment='center'
					decelerationRate='fast'
					style={styles.carousel}
					onViewableItemsChanged={onViewableItemsChangedShark}
					viewabilityConfig={viewabilityConfig}
				/>
				<View style={styles.dots}>
					{slidesShark.map((_, i) => (
						<View key={i} style={[styles.dot, i === indexShark && styles.dotActive]} />
					))}
				</View>

				<FlatList
					ref={listRefRay}
					data={slidesRay}
					keyExtractor={keyExtractor}
					renderItem={renderItemRay}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					snapToAlignment='center'
					decelerationRate='fast'
					style={styles.carousel}
					onViewableItemsChanged={onViewableItemsChangedRay}
					viewabilityConfig={viewabilityConfig}
				/>
				<View style={styles.dots}>
					{slidesRay.map((_, i) => (
						<View key={i} style={[styles.dot, i === indexRay && styles.dotActive]} />
					))}
				</View>

				<Pressable
					onPress={handleStart}
					onLayout={(e) => {
						const { y, height } = e.nativeEvent.layout
						setCtaLayout({ y, h: height })
					}}
					style={({ pressed }) => [styles.cta, Platform.OS === 'ios' && { opacity: pressed ? 0.85 : 1 }]}
					android_ripple={{ color: COLORS.mono_medium_soft }}
					accessibilityRole='button'
				>
					<MaterialCommunityIcons name='play-circle' size={36} color={COLORS.whiteForButtons} />
					<Text style={styles.ctaText}>Empezar identificación</Text>
				</Pressable>
			</ScrollView>

			<Animated.View
				style={[styles.containerFab, fabStyle]}
				pointerEvents={showFab ? 'auto' : 'none'}
			>
				<Pressable
					onPress={handleStart}
					style={({ pressed }) => [
						styles.fab,
						Platform.OS === 'ios' && { opacity: pressed ? 0.9 : 1 }
					]}
					android_ripple={{ color: COLORS.mono_medium_soft }}
					accessibilityRole='button'
					accessibilityLabel='Empezar identificación'
				>
					<MaterialCommunityIcons name='play-circle' size={40} color={COLORS.whiteForButtons} />
				</Pressable>
			</Animated.View>

			<Modal visible={viewerVisible} transparent onRequestClose={() => setViewerVisible(false)}>
				<ImageViewer
					imageUrls={imageUrls}
					index={viewerIndex}
					onChange={setViewerIndex}
					enableSwipeDown
					onSwipeDown={() => setViewerVisible(false)}
					saveToLocalByLongPress={false}
					renderHeader={() => (
						<Pressable
							onPress={() => setViewerVisible(false)}
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

			<ModalDefineType handleSelect={handleSelect} handleClose={() => setShowModalType(false)} visible={showModalType} />
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1, backgroundColor: COLORS.white1
	},
	container: {
		flex: 1
	},
	contentContainer: {
		paddingTop: 15,
		paddingHorizontal: 15,
		paddingBottom: 130
	},
	header: {
		fontSize: TEXT_SIZES.veryBig,
		color: COLORS.mono_black3,
		fontWeight: '500'
	},
	subheader: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		fontWeight: '500'
	},
	section1: {
		paddingBlock: 8,
		marginTop: 12,
		marginBottom: 8,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: COLORS.white4
	},
	section2: {
		paddingBottom: 10,
		marginBottom: 12,
		borderBottomWidth: 1,
		borderColor: COLORS.white4
	},
	carousel: {
		marginTop: 15
	},
	card: {
		position: 'relative',
		width: CARD_W,
		marginHorizontal: 4,
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 10,
		backgroundColor: COLORS.white1,
		overflow: 'hidden',
		paddingBottom: 5
	},
	image: {
		width: '100%',
		height: CARD_H
	},
	textCard: {
		marginTop: 5,
		paddingHorizontal: 10,
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		fontWeight: 'bold'
	},
	title: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		fontWeight: 'bold'
	},
	text: {
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_black3
	},
	dots: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 6
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.white5
	},
	dotActive: {
		backgroundColor: COLORS.primary1
	},
	cta: {
		marginTop: 25,
		paddingBlock: 6,
		borderRadius: 10,
		gap: 8,
		backgroundColor: COLORS.mono_dark,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: COLORS.mono_black3,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1
	},
	ctaText: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.whiteForButtons,
		fontWeight: '500'
	},
	containerFab: {
		position: 'absolute',
		zIndex: 2,
		right: 15,
		bottom: 130,
		borderRadius: 10,
		overflow: 'hidden',
		shadowColor: COLORS.mono_black3,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1
	},
	fab: {
		padding: 12,
		backgroundColor: COLORS.mono_dark,
		justifyContent: 'center',
		alignItems: 'center'
	}
})
