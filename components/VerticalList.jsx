import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { memo, useCallback, useMemo } from 'react'
import { Dimensions, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { getSpeciesImage } from '../config/imageLoader/Species'
import { COLORS, TEXT_SIZES, textStyles } from '../globals'
import MantaSvg from './AnchorSvgAnimated'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const ICON_SIZE = Math.min(WIDTH, HEIGHT) / 16

const RenderItem = memo(
	({ item, onPress }) => {
		if (item.extra) return <View style={listStyles.extraItem} />

		const img = useMemo(() => getSpeciesImage(1), [item.image])
		const [genus, species] = (item.name || '').split(' ')

		return (
			<View style={listStyles.containerCardVertical}>
				<Pressable
					style={({ pressed }) => [
						listStyles.cardVertical,
						Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
					]}
					onPress={onPress}
					android_ripple={{ color: COLORS.ripple }}
					accessibilityRole='button'
				>
					<View style={listStyles.containerHeaderCard}>
						<View style={listStyles.headerCard}>
							<Text style={listStyles.cardText}>{genus}</Text>
							<Text style={listStyles.cardText}>{species}</Text>
						</View>

						{item.type === 'Raya'
							? <MantaSvg strokeColor={COLORS.primary1} color={COLORS.primary1} height={ICON_SIZE} width={ICON_SIZE} />
							: <MaterialCommunityIcons name='shark' size={ICON_SIZE} color={COLORS.primary1} />
						}
					</View>

					<Image source={img} style={listStyles.cardImg} contentFit='cover' transition={100} />

					<View style={listStyles.containerTextName}>
						<Text style={listStyles.cardName}>{item.common_name?.split(',')[0] || 'Sin nombre común'}</Text>
					</View>
				</Pressable>
			</View>
		)
	},
	(prev, next) => {
		const a = prev.item
		const b = next.item
		return a._id === b._id
			&& a.name === b.name
			&& a.type === b.type
			&& a.common_name === b.common_name
			&& prev.onPress === next.onPress
	}
)

const VerticalList = ({ title = '', data = [] }) => {
	const router = useRouter()

	const renderItem = useCallback(({ item }) => {
		const onPress = () => {
			router.push({
				pathname: '/specie',
				params: { ...item }
			})
		}
		return <RenderItem item={item} onPress={onPress} />
	}, [router])

	const getItemLayout = useCallback((_, index) => ({
		length: HEIGHT / 4.6,
		offset: (HEIGHT / 4.6) * index,
		index
	}), [])

	const preparedData = useMemo(() => (
		data.length % 2 === 0 ? data : [...data, { extra: true }]
	), [data])

	return (
		<>
			{preparedData.length > 0 && (
				<View style={listStyles.verticalListContainer}>
					<View style={listStyles.containerTitleCard}>
						<MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.small} color={COLORS.primary1} />
						<Text style={textStyles.titleItem}>
							{title} <Text style={{ fontSize: TEXT_SIZES.small }}>({data.length})</Text>
						</Text>
					</View>

					<FlatList
						data={preparedData}
						numColumns={2}
						renderItem={renderItem}
						keyExtractor={(item, index) => item._id ?? `extra-${index}`}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={listStyles.flatListContentContainer}
						nestedScrollEnabled={true}
						columnWrapperStyle={listStyles.columnWrapperStyle}

						// perf
						initialNumToRender={8}
						windowSize={5}
						maxToRenderPerBatch={8}
						updateCellsBatchingPeriod={50}
						removeClippedSubviews={true}
						getItemLayout={getItemLayout}
					/>
				</View>
			)}
		</>
	)
}

const listStyles = StyleSheet.create({
	verticalListContainer: {
		height: HEIGHT - 80,
		marginTop: 10,
		gap: 5
	},
	flatListContentContainer: {
		paddingHorizontal: 8,
		paddingTop: 5,
		paddingBottom: 160,
		gap: 14
	},
	columnWrapperStyle: {
		justifyContent: 'space-between',
		gap: 14
	},
	extraItem: {
		flex: 1,
		paddingHorizontal: 10
	},
	containerTitleCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10
	},
	containerCardVertical: {
		flex: 1,
		height: HEIGHT / 4.8,
		overflow: 'hidden',
		borderWidth: 1,
		borderRadius: 10,
		borderColor: COLORS.white5,
		backgroundColor: COLORS.white1,
		shadowColor: COLORS.mono_black3,
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 1
	},
	cardVertical: {
		flex: 1,
		paddingHorizontal: 12,
		paddingVertical: 10,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	containerHeaderCard: {
		flexDirection: 'row'
	},
	headerCard: {
		flex: 1
	},
	cardText: {
		lineHeight: TEXT_SIZES.small + 2,
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_black3,
		fontStyle: 'italic'
	},
	containerTextName: {
		height: HEIGHT / 24,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cardName: {
		lineHeight: TEXT_SIZES.small,
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_black3,
		fontWeight: '500',
		textAlign: 'center'
	},
	cardImg: {
		width: '100%',
		height: HEIGHT / 10,
		borderRadius: 8,
		marginVertical: 5
	}
})

export default VerticalList
