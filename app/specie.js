import { useEffect, useMemo, useState } from 'react'
import { Dimensions, Modal, Platform, Pressable, Image as RNImage, ScrollView, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'

import ImageViewer from 'react-native-image-zoom-viewer'
import MantaSvg from '../components/AnchorSvgAnimated'
import HeaderPage from '../components/HeaderPage'
import { useRealm } from '../config/db/provider'
import { getSpeciesImage } from '../config/imageLoader/Species'
import { COLORS, TEXT_SIZES } from '../globals'
import { useMainStore } from '../store/mainStore'
import { getStatusColor, parseArray, parseNumber } from '../utils/utilities'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const ICON_SIZE = Math.min(WIDTH, HEIGHT) / 14

export default function Specie() {
	const realm = useRealm()
	const params = useLocalSearchParams()
	const { showModalStateConservation } = useMainStore()

	const [viewerVisible, setViewerVisible] = useState(false)
	const [stateConservData, setStateConservData] = useState('')
	const [stateConserv, setStateConserv] = useState({
		abbreviation: '',
		name: '',
		description: ''
	})

	const data = useMemo(() => ({
		name: params.name || '',
		common_name: params.common_name || '',
		habitat: params.habitat || '',
		marine_habitat: params.marine_habitat || '',
		location: parseArray(params.location),
		state: params.state || '',
		type: params.type || '',
		order: params.order || '',
		family: params.family || '',
		size: parseNumber(params.size),
		age: parseNumber(params.age),
		depth_min: parseNumber(params.depth_min),
		depth_max: parseNumber(params.depth_max),
		description: params.description || '',
		repro_char: params.repro_char || '',
		diet: parseArray(params.diet)
	}), [params])

	const img = getSpeciesImage(/* data.image */ 1)
	const [genus, species] = (data.name || '').split(' ')

	const viewerImages = useMemo(() => {
		const src = typeof img === 'number' ? RNImage.resolveAssetSource(img) : img
		const url = typeof src === 'object' && src?.uri ? src.uri : ''
		return [{ url }] 
	}, [img])

	useEffect(() => {
		if (!realm) return
		const rs = realm.objects('StateConservation')
		const found = realm.objects('StateConservation').filtered(`abbreviation == "${data.state || 'DD'}"`)[0]

		if (found) {
			setStateConserv({
				abbreviation: found.abbreviation,
				name: found.name,
				description: found.description
			})
		}

		setStateConservData(rs)
	}, [realm])

	return (
		<>
			<HeaderPage />

			<View style={styles.containerSpecie}>
				<View style={styles.containerTextNamesSpecie}>
					<View style={styles.containerNameSpecies}>
						{data.type === 'Raya' ? (
							<MantaSvg
								strokeColor={COLORS.primary1}
								color={COLORS.primary1}
								height={ICON_SIZE}
								width={ICON_SIZE}
							/>
						) : (
							<MaterialCommunityIcons name='shark' size={ICON_SIZE} color={COLORS.primary1} />
						)}
						<Text style={styles.textNameEspecie}>{genus} {species}</Text>
					</View>
					<Text style={styles.textCommonNameEspecie}>
						<Text style={styles.commonNameText}>Nombres comunes: </Text>{data.common_name || 'Sin nombre común'}
					</Text>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.containerScroll}
					contentContainerStyle={styles.containerContentScroll}
				>
					<View style={styles.containerHeaderSpecie}>
						<View style={styles.containerSectionHeader}>
							<View style={styles.containerSectionName}>
								<MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.small} color={COLORS.green} />
								<Text style={styles.titleHeaderSpecie}>Orden</Text>
							</View>
							<Text style={styles.textHeaderSpecie}>{data.order}</Text>
						</View>
						<View style={[styles.containerSectionHeader]}>
							<View style={styles.containerSectionName}>
								<MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.small} color={COLORS.orange} />
								<Text style={styles.titleHeaderSpecie}>Familia</Text>
							</View>
							<Text style={styles.textHeaderSpecie}>{data.family}</Text>
						</View>
					</View>

					<View style={styles.containerImageSpecie}>
						<Pressable
							onPress={() => setViewerVisible(true)}
							style={({ pressed }) => [Platform.OS === 'ios' && { opacity: pressed ? 0.9 : 1 }]}
							android_ripple={{ color: COLORS.ripple }}
							accessibilityRole="imagebutton"
							accessibilityLabel="Ampliar imagen de la especie"
						>
							<RNImage source={img} style={styles.containerCardImg} contentFit="cover" />
						</Pressable>
					</View>

					<View style={styles.containerText}>
						<Text style={styles.textDescItem}>Longevidad: <Text style={styles.textItem}>{data.age || '-'} años</Text></Text>
						<Text style={styles.textDescItem}>Profundidad: <Text style={styles.textItem}>{data.depth_min ?? '-'} - {data.depth_max ?? '-'} m</Text></Text>
						<Text style={styles.textDescItem}>Tamaño: <Text style={styles.textItem}>{data.size || '-'} cm</Text></Text>
					</View>

					<View style={styles.containerText}>
						<Text style={styles.textDescItem}>Hábitat: <Text style={styles.textItem}>{data.habitat || '-'}</Text></Text>
						<Text style={styles.textDescItem}>Hábitat marino: <Text style={styles.textItem}>{data.marine_habitat || '-'}</Text></Text>
						<Text style={styles.textDescItem}>Localización: <Text style={styles.textItem}>{data.location || '-'}</Text></Text>
					</View>

					<View style={styles.containerBodiesLinear}>
						<View style={styles.containerPressableLinear}>
							<Pressable
								onPress={() => showModalStateConservation({ states : stateConservData })}
								style={({ pressed }) => [styles.pressableLinear, Platform.OS === 'ios' && { opacity: pressed ? 0.7 : 1 }]}
								android_ripple={{ color: COLORS.ripple }}
								accessibilityRole='button'
							>
								<Text style={styles.textDescItem}>Estado de conservación: </Text>
								<Text style={styles.textItem}><MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.small} color={getStatusColor(stateConserv.abbreviation)} /> {stateConserv.abbreviation} - {stateConserv.name}</Text>
								<MaterialCommunityIcons name="arrow-top-right-bold-box-outline" size={15} color={COLORS.white5} style={{ position: 'absolute', top: 5, right: 5 }} />
							</Pressable>
						</View>

						<View style={styles.containerBodyLinearSpecie}>
							<Text style={styles.textDescItem}>Dieta:</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								{data.diet.length > 0
									? data.diet.map((item, i) => (
										<Text key={`${item}-${i}`} style={styles.textItem}>
											{i === data.diet.length - 1 ? item : `${item}, `}
										</Text>
									))
									: <Text style={styles.textItem}>-</Text>
								}
							</View>
						</View>

						<View style={styles.containerBodyLinearSpecie}>
							<Text style={styles.textDescItem}>Características morfológicas:</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								<Text style={styles.textItem}>{data.description || '-'}</Text>
							</View>
						</View>

						<View style={styles.containerBodyLinearSpecie}>
							<Text style={styles.textDescItem}>Características reproductivas:</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								<Text style={styles.textItem}>{data.repro_char || '-'}</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>

			<Modal visible={viewerVisible} transparent onRequestClose={() => setViewerVisible(false)}>
				<ImageViewer
					imageUrls={viewerImages}
					index={0}
					enableSwipeDown
					onSwipeDown={() => setViewerVisible(false)}
					saveToLocalByLongPress={false}
					backgroundColor={COLORS.mono_black1}
					renderHeader={() => (
						<Pressable
							onPress={() => setViewerVisible(false)}
							accessibilityRole="button"
							style={({ pressed }) => [
								{ position: 'absolute', top: 20, right: 20, zIndex: 2 },
								Platform.OS === 'ios' && { opacity: pressed ? 0.85 : 1 }
							]}
							android_ripple={{ color: COLORS.ripple }}
						>
							<MaterialCommunityIcons name="window-close" size={30} color={COLORS.white1} />
						</Pressable>
					)}
					renderFooter={() => (
						<View style={{ paddingBottom: 40, paddingHorizontal: 20 }}>
							<Text style={{ color: COLORS.white2, fontWeight: '500', fontSize: TEXT_SIZES.medium }}>
								{data.common_name || `${genus} ${species}`}
							</Text>
						</View>
					)}
				/>
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
	containerSpecie: {
		flex: 1,
		backgroundColor: COLORS.white1
	},
	containerScroll: {
		flex: 1
	},
	containerContentScroll: {
		padding: 15
	},
	containerHeaderSpecie: {
		width: '100%',
		flexDirection: 'row',
		marginBottom: 20,
		gap: 8
	},
	containerSectionHeader: {
		flex: 1,
		justifyContent: 'center',
		padding: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: COLORS.white5,
		backgroundColor: COLORS.white1
	},
	containerSectionName: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	titleHeaderSpecie: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black2
	},
	textHeaderSpecie: {
		fontSize: TEXT_SIZES.big,
		fontWeight: '500',
		fontStyle: 'italic',
		color: COLORS.mono_black3,
		textAlign: 'center'
	},
	containerTextNamesSpecie: {
		paddingBottom: 15,
		marginHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.white5
	},
	containerNameSpecies: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5
	},
	textNameEspecie: {
		fontSize: TEXT_SIZES.veryBig,
		color: COLORS.mono_black2,
		fontStyle: 'italic',
		fontWeight: '500',
	},
	textCommonNameEspecie: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		marginTop: 5
	},
	commonNameText: {
		fontWeight: '500',
		color: COLORS.mono_black2
	},
	containerImageSpecie: {
		width: '100%',
		maxHeight: HEIGHT / 5,
		marginBottom: 10
	},
	containerCardImg: {
		width: '100%',
		height: '100%',
		borderRadius: 8
	},
	containerText: {
		flex: 1,
		gap: 2,
		marginVertical: 5
	},
	containerPressableLinear: {
		position: 'relative',
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 5,
		backgroundColor: COLORS.white1
	},
	pressableLinear: {
		paddingBlock: 5,
		paddingHorizontal: 10,
		gap: 1
	},
	containerBodiesLinear: {
		flex: 1,
		marginVertical: 10,
		gap: 8
	},
	containerBodyLinearSpecie: {
		paddingBlock: 5,
		paddingHorizontal: 10,
		gap: 1,
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 5,
		backgroundColor: COLORS.white1
	},
	textDescItem: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black2,
		fontWeight: '500'
	},
	textItem: {
		lineHeight: TEXT_SIZES.small + 3,
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_black3,
		fontWeight: '400'
	}
})
