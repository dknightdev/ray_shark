import { Tabs } from 'expo-router'
import CustomTabBar from '../../components/CustomTabBar'

export default function TabsLayout() {
	return (
		<Tabs
			initialRouteName='search'
			screenOptions={{ headerShown: false }}
			tabBar={props => <CustomTabBar {...props} />}
		>
			<Tabs.Screen name="glossary" options={{ title: 'Glosario' }} />
			<Tabs.Screen name="search" options={{ title: 'Buscar' }} />
			<Tabs.Screen name="identify" options={{ title: 'Identificar' }} />
		</Tabs>
	)
}
