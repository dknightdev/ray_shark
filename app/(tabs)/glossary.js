import { memo, useCallback, useEffect, useState } from 'react'
import { Dimensions, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import CustomInput from '../../components/CustomInput'
import NoResults from '../../components/NoResults'
import SearchLoading from '../../components/SearchLoading'
import { useRealm } from '../../config/db/provider'
import { COLORS, TEXT_SIZES } from '../../globals'
import useDebounce from '../../hooks/useDebounce'
import { useMainStore } from '../../store/mainStore'

const { height: HEIGHT } = Dimensions.get('window')
const ROW_HEIGHT = 64

const Row = memo(
	({ id, word, definition, onPressId }) => {
		return (
			<Pressable
				onPress={() => onPressId(id)}
				style={({ pressed }) => [styles.row, Platform.OS === 'ios' && { opacity: pressed ? 0.7 : 1 }]}
				android_ripple={{ color: COLORS.ripple }}
				accessibilityRole='button'
			>
				<Text style={styles.word} numberOfLines={1}>{word}</Text>
				<Text style={styles.definition} numberOfLines={2}>{definition}</Text>
				<MaterialCommunityIcons name="arrow-top-right-bold-box-outline" size={15} color={COLORS.white5} style={{ position: 'absolute', top: 5, right: 5 }} />
			</Pressable>
		)
	},
	(prev, next) => prev.id === next.id && prev.word === next.word && prev.definition === next.definition && prev.onPressId === next.onPressId
)

export default function Glossary() {
	const realm = useRealm()
	const { showModalDefinition } = useMainStore()

	const [valueInputFilter, setValueInputFilter] = useState('')
	const [isSearching, setIsSearching] = useState(false)
	const [list, setList] = useState([])

	const debouncedValue = useDebounce(valueInputFilter, 200)

	useEffect(() => {
		if (!realm) return
		setIsSearching(true)
		setTimeout(() => {
			const rs = realm.objects('Glossary').sorted('word')
			const data = rs.map(g => ({
				id: g._id.toString(),
				word: g.word || '',
				definition: g.definition || ''
			}))
			setList(data)
			setIsSearching(false)
		}, 0)
	}, [realm])

	useEffect(() => {
		if (!realm) return
		setIsSearching(true)
		setTimeout(() => {
			let rs
			if (!debouncedValue) {
				rs = realm.objects('Glossary').sorted('word')
			} else {
				rs = realm.objects('Glossary')
					.filtered(
						'word CONTAINS[c] $0 OR definition CONTAINS[c] $0',
						debouncedValue
					)
					.sorted('word')
			}

			const data = rs.map(g => ({
				id: g._id.toString(),
				word: g.word || '',
				definition: g.definition || ''
			}))

			setList(data)
			setIsSearching(false)
		}, 0)
	}, [debouncedValue, realm])

	const onPressId = useCallback(item => {
		showModalDefinition({
			word: item.word,
			definition: item.definition
		})
	}, [])

	const keyExtractor = useCallback((item) => item.id, [])

	const getItemLayout = useCallback((_, index) => ({
		length: ROW_HEIGHT,
		offset: ROW_HEIGHT * index,
		index
	}), [])

	const renderItem = useCallback(({ item }) => (
		<Row id={item.id} word={item.word} definition={item.definition} onPressId={() => onPressId(item)} />
	), [onPressId])

	const empty = !isSearching && list.length === 0

	return (
		<View style={styles.container}>
			<CustomInput
				label='Buscar términos'
				value={valueInputFilter}
				onChangeText={setValueInputFilter}
				rightIcon='magnify'
			/>

			{isSearching ? (
				<SearchLoading />
			) : empty ? (
				<NoResults />
			) : (
				<FlatList
					data={list}
					renderItem={renderItem}
					keyExtractor={keyExtractor}
					contentContainerStyle={styles.listContent}
					ItemSeparatorComponent={() => <View style={styles.sep} />}
					getItemLayout={getItemLayout}
					initialNumToRender={12}
					windowSize={10}
					maxToRenderPerBatch={12}
					updateCellsBatchingPeriod={16}
					removeClippedSubviews={true}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: HEIGHT,
		backgroundColor: COLORS.white1,
		paddingTop: 15,
		paddingHorizontal: 15
	},
	listContent: {
		paddingTop: 15,
		paddingBottom: 160
	},
	sep: {
		height: 8
	},
	row: {
		position: 'relative',
		minHeight: ROW_HEIGHT,
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 5,
		backgroundColor: COLORS.white1,
		paddingVertical: 5,
		paddingHorizontal: 10,
		gap: 2,
		shadowColor: COLORS.mono_black3,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1
	},
	word: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3,
		fontWeight: '500'
	},
	definition: {
		lineHeight: TEXT_SIZES.small + 1,
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_black3
	}
})
