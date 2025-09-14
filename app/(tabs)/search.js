import { useCallback, useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import CustomFilter from '../../components/CustomFilter'
import CustomInput from '../../components/CustomInput'
import HorizontalList from '../../components/HorizontalList'
import NoResults from '../../components/NoResults'
import SearchLoading from '../../components/SearchLoading'
import VerticalList from '../../components/VerticalList'

import { useRealm } from '../../config/db/provider'
import { COLORS } from '../../globals'
import useDebounce from '../../hooks/useDebounce'

const { height: HEIGHT } = Dimensions.get('window')

export default function Search() {
	const realm = useRealm()

	const [valueInputFilter, setValueInputFilter] = useState('')
	const [isSearching, setIsSearching] = useState(false)

	const [filteredData, setFilteredData] = useState({
		locations: [],
		orders: [],
		families: [],
		genders: [],
		species: []
	})
	const [dataFilter, setDataFilter] = useState({
		location: '',
		order: '',
		family: '',
		gender: '',
		showFilter: false
	})

	const debouncedValue = useDebounce(valueInputFilter, 200)

	useEffect(() => {
		if (!realm) return
		setIsSearching(true)
		setTimeout(() => {
			const locations = realm.objects('Locations')
			const orders = realm.objects('Orders')
			const families = realm.objects('Families')
			const genders = realm.objects('Genders')
			const species = realm.objects('Species')
			setFilteredData({ locations, orders, families, genders, species })
			setIsSearching(false)
		}, 0)
	}, [realm])

	const performSearch = useCallback(() => {
		if (!realm) return

		setIsSearching(true)

		setTimeout(() => {
			let filterLocations = realm.objects('Locations')
			let filteredOrders = realm.objects('Orders')
			let filteredFamilies = realm.objects('Families')
			let filteredGenders = realm.objects('Genders')
			let filteredSpecies = realm.objects('Species')

			if (dataFilter.location) {
				filteredOrders = filteredOrders.filtered(`location CONTAINS[c] $0`, dataFilter.location)
				filteredFamilies = filteredFamilies.filtered(`location CONTAINS[c] $0`, dataFilter.location)
				filteredGenders = filteredGenders.filtered(`location CONTAINS[c] $0`, dataFilter.location)
				filteredSpecies = filteredSpecies.filtered(`location CONTAINS[c] $0`, dataFilter.location)
			}

			if (dataFilter.order) {
				filteredFamilies = filteredFamilies.filtered(`order == $0`, dataFilter.order)
				filteredGenders = filteredGenders.filtered(`order == $0`, dataFilter.order)
				filteredSpecies = filteredSpecies.filtered(`order == $0`, dataFilter.order)
			}

			if (dataFilter.family) {
				filteredGenders = filteredGenders.filtered(`family == $0`, dataFilter.family)
				filteredSpecies = filteredSpecies.filtered(`family == $0`, dataFilter.family)
			}

			if (dataFilter.gender) {
				filteredSpecies = filteredSpecies.filtered(`gender == $0`, dataFilter.gender)
			}

			if (debouncedValue) {
				filterLocations = filterLocations.filtered(`name CONTAINS[c] $0`, debouncedValue)
				filteredOrders = filteredOrders.filtered(`name CONTAINS[c] $0`, debouncedValue)
				filteredFamilies = filteredFamilies.filtered(`name CONTAINS[c] $0`, debouncedValue)
				filteredGenders = filteredGenders.filtered(`name CONTAINS[c] $0`, debouncedValue)
				filteredSpecies = filteredSpecies.filtered(`name CONTAINS[c] $0 OR common_name CONTAINS[c] $0`, debouncedValue)
			}

			setFilteredData({
				locations: filterLocations,
				orders: filteredOrders,
				families: filteredFamilies,
				genders: filteredGenders,
				species: filteredSpecies
			})

			setIsSearching(false)
		}, 0)
	}, [debouncedValue, dataFilter, realm])

	useEffect(() => {
		performSearch()
	}, [debouncedValue, performSearch, dataFilter])

	const handlePressLocation = location => {
		setDataFilter(prev => ({
			...prev,
			location: location.name,
			showFilter: true
		}))
		setValueInputFilter('')
	}

	const handlePressOrder = order => {
		setDataFilter(prev => ({
			...prev,
			order: order.name,
			family: '',
			gender: '',
			showFilter: true
		}))
		setValueInputFilter('')
	}

	const handlePressFamily = family => {
		setDataFilter(prev => ({
			...prev,
			family: family.name,
			gender: '',
			showFilter: true
		}))
		setValueInputFilter('')
	}

	const handlePressGender = gender => {
		setDataFilter(prev => ({
			...prev,
			gender: gender.name,
			showFilter: true
		}))
		setValueInputFilter('')
	}

	const handlePressItemFilter = item => {
		setDataFilter(prev => {
			const showFilter = !Object.keys(prev)
				.filter(key => key !== item && key !== 'showFilter')
				.every(key => prev[key] == '')
			return { ...prev, [item]: '', showFilter }
		})
		setValueInputFilter('')
	}

	return (
		<View style={searchStyles.containerSearch}>
			<CustomInput
				label='Buscar especies'
				value={valueInputFilter}
				onChangeText={setValueInputFilter}
				rightIcon='magnify'
			/>

			<ScrollView
				style={searchStyles.scrollSearch}
				contentContainerStyle={searchStyles.containerSearchScroll}
				nestedScrollEnabled={true}
				disableIntervalMomentum={true}
				disableScrollViewPanResponder={true}
				disallowInterruption={true}
			>
				<CustomFilter dataFilter={dataFilter} handlePressItemFilter={handlePressItemFilter} />

				<View style={{ flex: 1 }}>
					{isSearching ? (
						<SearchLoading />
					) : (
						<View style={{ flex: 1, gap: 5 }}>
							{!dataFilter.location && (
								<HorizontalList title='Localizaciones' handlePress={handlePressLocation} data={filteredData.locations} />
							)}

							{(!dataFilter.order && !(dataFilter.family || dataFilter.gender)) && (
								<HorizontalList title='Órdenes' handlePress={handlePressOrder} data={filteredData.orders} />
							)}

							{(!dataFilter.family && !dataFilter.gender) && (
								<HorizontalList title='Familias' handlePress={handlePressFamily} data={filteredData.families} />
							)}

							{!dataFilter.gender && (
								<HorizontalList title='Géneros' handlePress={handlePressGender} data={filteredData.genders} />
							)}

							<VerticalList title='Especies' data={filteredData.species} />

							{filteredData.orders.length === 0 &&
								filteredData.families.length === 0 &&
								filteredData.genders.length === 0 &&
								filteredData.species.length === 0 && (
									<NoResults />
								)}
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	)
}

const searchStyles = StyleSheet.create({
	containerSearch: {
		height: HEIGHT,
		backgroundColor: COLORS.white1,
		paddingTop: 15,
		paddingHorizontal: 15
	},
	scrollSearch: {
		flex: 1,
		marginTop: 10
	},
	containerSearchScroll: {
		gap: 12,
		paddingTop: 5
	}
})
