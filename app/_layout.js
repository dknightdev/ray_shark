import 'react-native-gesture-handler'
import 'react-native-reanimated'

import * as NavigationBar from 'expo-navigation-bar'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

import Loading from '../components/Loading'
import ModalAlert from '../components/ModalAlert'
import ModalDefinition from '../components/ModalDefinition'
import ModalStateConservation from '../components/ModalStateConservation'
import RealmProvider from '../config/db/provider'
import { COLORS } from '../globals'
import { useMainStore } from '../store/mainStore'

const AppShell = () => {
	const { loading, alert, modalDefinition, modalStateConservation } = useMainStore()
	const insets = useSafeAreaInsets()

	useEffect(() => {
		NavigationBar.setBackgroundColorAsync(COLORS.mono_dark)
		NavigationBar.setButtonStyleAsync('light')
		NavigationBar.setBorderColorAsync('transparent')
	}, [])

	return (
		<>
			<StatusBar style='light' translucent />

			<View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: COLORS.mono_dark, zIndex: 1 }} />
			<View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: COLORS.white1 }}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="specie" />
				</Stack>
			</View>

			{alert?.show && <ModalAlert data={alert} />}
			{modalDefinition?.show && <ModalDefinition data={modalDefinition} />}
			{modalStateConservation?.show && <ModalStateConservation data={modalStateConservation} />}
			{loading && <Loading />}
		</>
	)
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<RealmProvider>
					<AppShell />
				</RealmProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
