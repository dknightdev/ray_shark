import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, TEXT_SIZES } from '../globals'

const FilterChip = ({ label, value, color, onPress }) => {
	if (!value || (Array.isArray(value) && value.length === 0)) return null

	return (
		<View style={filterStyles.containerItemFilter}>
			<Pressable
				onPress={onPress}
				android_ripple={{ color: COLORS.ripple }}
				style={({ pressed }) => [
					filterStyles.itemFilter,
					Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }
				]}
				accessibilityRole='button'
			>
				<View style={filterStyles.containerHeaderItemFilter}>
					<MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.medium} color={color} />
					<Text style={filterStyles.textFilter}>{label}</Text>
					<MaterialCommunityIcons name='close' size={TEXT_SIZES.small} color={COLORS.red} style={filterStyles.iconDeleteFilter} />
				</View>
				<Text style={filterStyles.textFilterItem}>
					{Array.isArray(value) ? value.join(', ') : value}
				</Text>
			</Pressable>
		</View>
	)
}

const CustomFilter = ({ style, dataFilter, handlePressItemFilter }) => {
	if (!dataFilter?.showFilter) return null

	return (
		<View style={[style, filterStyles.containerFilter]}>
			<Text style={filterStyles.textFilterTitle}>Filtros aplicados</Text>

			<View style={filterStyles.containerSectionFilter}>
				<FilterChip
					label='Localización'
					value={dataFilter.location}
					color={COLORS.blue}
					onPress={() => handlePressItemFilter('location')}
				/>
				<FilterChip
					label='Orden'
					value={dataFilter.order}
					color={COLORS.green}
					onPress={() => handlePressItemFilter('order')}
				/>
				<FilterChip
					label='Familia'
					value={dataFilter.family}
					color={COLORS.orange}
					onPress={() => handlePressItemFilter('family')}
				/>
				<FilterChip
					label='Género'
					value={dataFilter.gender}
					color={COLORS.red}
					onPress={() => handlePressItemFilter('gender')}
				/>
			</View>
		</View>
	)
}

const filterStyles = StyleSheet.create({
	containerFilter: {
		width: '100%',
		justifyContent: 'center',
		gap: 5,
		borderBottomWidth: 1,
		borderColor: COLORS.white4,
		paddingBottom: 15
	},
	containerSectionFilter: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 8,
	},
	containerHeaderItemFilter: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		paddingHorizontal: 5
	},
	iconDeleteFilter: {
		marginLeft: 'auto'
	},
	containerItemFilter: {
		flex: 1,
		maxWidth: '49%',
		minWidth: '40%',
		overflow: 'hidden',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: COLORS.white5,
		backgroundColor: COLORS.white1
	},
	itemFilter: {
		width: '100%',
		paddingVertical: 4,
		paddingHorizontal: 2
	},
	textFilter: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black2,
		fontWeight: '500'
	},
	textFilterItem: {
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_black3,
		alignSelf: 'center'
	},
	textFilterTitle: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_black2,
		fontWeight: '500'
	}
})

export default CustomFilter
