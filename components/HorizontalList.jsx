import { memo, useCallback } from 'react'
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, TEXT_SIZES, textStyles } from '../globals'

const RenderItem = memo(({ item, handlePress }) => (
	<View style={listStyles.containerCardHorizontal}>
		<Pressable
			style={({ pressed }) => [
				listStyles.cardHorizontal,
				Platform.OS === 'ios' && { opacity: pressed ? 0.6 : 1 }
			]}
			onPress={handlePress}
			android_ripple={{ color: COLORS.ripple }}
			accessibilityRole='button'
		>
			<Text style={listStyles.cardText}>{item.name}</Text>
		</Pressable>
	</View>
))

const HorizontalList = ({ title = '', handlePress = () => {}, data = [] }) => {
	const themeColor = () => {
		switch (title) {
			case 'Localizaciones':
				return COLORS.blue
			case 'Órdenes':
				return COLORS.green
			case 'Familias':
				return COLORS.orange
			case 'Géneros':
				return COLORS.red
			default:
				return COLORS.primary1
		}
	}

	const renderItem = useCallback(({ item }) => {
		return <RenderItem item={item} handlePress={() => handlePress(item)} />
	}, [handlePress])

	return (
		<>
			{data.length > 0 && (
				<View style={listStyles.horizontalListContainer}>
					<View style={listStyles.containerTitleCard}>
						<MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.small} color={themeColor()} />
						<Text style={textStyles.titleItem}>
							{title} <Text style={{ fontSize: TEXT_SIZES.small }}>({data.length})</Text>
						</Text>
					</View>

					<FlatList
						data={data}
						renderItem={renderItem}
						keyExtractor={item => item._id}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={listStyles.flatListContentContainer}
						initialNumToRender={4}
					/>
				</View>
			)}
		</>
	)
}

const listStyles = StyleSheet.create({
	horizontalListContainer: {
		minHeight: 60
	},
	flatListContentContainer: {
		paddingHorizontal: 8,
		paddingVertical: 8,
		gap: 8
	},
	containerTitleCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	containerCardHorizontal: {
		overflow: 'hidden',
		borderRadius: 5
	},
	cardHorizontal: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: COLORS.white5,
		backgroundColor: COLORS.white1,
		shadowColor: COLORS.mono_black2,
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 1
	},
	cardText: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3
	}
})

export default HorizontalList
