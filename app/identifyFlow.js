import { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRealm } from '../config/db/provider'
import { COLORS, TEXT_SIZES } from '../globals'

import { useLocalSearchParams } from 'expo-router'
import HeaderPage from '../components/HeaderPage'
import ModalInfoImages from '../components/ModalInfoImages'


export default function IdentifyFlow() {
	const realm = useRealm()
	const { type } = useLocalSearchParams()

	const [showModalInfoImages, setShowModalInfoImages] = useState(false)

	const [orderTree, setOrderTree] = useState(null)
	const [familyTree, setFamilyTree] = useState(null)
	const [genderTree, setGenderTree] = useState(null)

	const [currentId, setCurrentId] = useState(1)
	const [answers, setAnswers] = useState([])
	const [found, setFound] = useState({ order: null, family: null, genus: null })

	const [stage, setStage] = useState('order')

	const activeTree = useMemo(() => {
		if (stage === 'order') return orderTree
		if (stage === 'family') return familyTree
		return genderTree
	}, [stage, orderTree, familyTree, genderTree])

	useEffect(() => {
		if (!realm) return
		const filterType = type === 'shark' ? 'shark' : 'ray'
		const pick = (lvl) => realm.objects('DichoKeyTree').filtered('level == $0 AND type == $1', lvl, filterType)[0]
		const toPlain = (tree) => (tree ? JSON.parse(JSON.stringify(tree)) : null)

		setOrderTree(toPlain(pick('order')))
		setFamilyTree(toPlain(pick('family')))
		setGenderTree(toPlain(pick('gender')))

		setStage('order')
		setCurrentId(1)
		setAnswers([])
		setFound({ order: null, family: null, genus: null })
	}, [realm])

	const nodes = useMemo(() => activeTree?.nodes ?? [], [activeTree])
	const nodeMap = useMemo(() => {
		const m = new Map()
		nodes.forEach(n => m.set(n.id, n))
		return m
	}, [nodes])

	const currentNode = nodeMap.get(currentId)

	const handlePick = useCallback((opt, node) => {
		setAnswers(prev => [...prev, { id: node.id, code: opt.code, text: opt.text }])

		if (opt.next != null) {
			setCurrentId(opt.next)
		} else if (opt.result) {
			setFound(prev => {
				if (stage === 'order') return { ...prev, order: opt.result }
				if (stage === 'family') return { ...prev, family: opt.result }
				return { ...prev, genus: opt.result }
			})
		}
	}, [stage])

	const goBack = useCallback(() => {
		if (answers.length > 0) {
			const prev = answers.slice(0, -1)
			setAnswers(prev)
			setFound(f => ({...f, [stage]: null}))

			let id = 1
			for (const a of prev) {
				const n = nodeMap.get(id)
				if (!n) break
				const chosen = n.options.find(o => o.code === a.code && o.text === a.text)
				if(chosen?.next != null) {
					id = chosen.next
				} else break
			}
			setCurrentId(id)
		} else if (stage !== 'order') {
			const prevStage = stage === 'genus' ? 'family' : 'order'
			setStage(prevStage)
			setCurrentId(1)
			setAnswers([])
		}
	}, [answers, nodeMap, stage])

	const resetFlow = useCallback(() => {
		setStage('order')
		setAnswers([])
		setFound({ order: null, family: null, genus: null })
		setCurrentId(1)
	}, [])

	const continueToFamily = useCallback(() => {
		if (!found.order) return
		setStage('family')
		setCurrentId(1)
		setAnswers([])
	}, [found.order])

	const continueToGenus = useCallback(() => {
		if (!found.family) return
		setStage('genus')
		setCurrentId(1)
		setAnswers([])
	}, [found.family])

	const stageTitle = stage === 'order'
		? 'Identificación del Orden'
		: stage === 'family'
		? 'Identificación de la Familia'
		: 'Identificación del Género'

	return (
		<>
			<ModalInfoImages handleClose={() => setShowModalInfoImages(false)} visible={showModalInfoImages} type={type} />

			<HeaderPage RightButton={() => (
				<View style={styles.containerHeaderBtn}>
					<Pressable
						style={({ pressed }) => [
							styles.buttonInfo,
							Platform.OS === 'ios' && { opacity: pressed ? 0.6 : 1 }
						]}
						onPress={() => setShowModalInfoImages(true)}
						android_ripple={{ color: COLORS.ripple }}
						accessibilityRole='button'
					>	
						<MaterialCommunityIcons name='information-outline' size={26} color={COLORS.mono_black3} />
					</Pressable>
				</View>
			)} />

			<View style={styles.container}>
				<View style={styles.progressBar}>
					<Chip
						label='Tipo'
						color={COLORS.primary1}
						value={type === 'shark' ? 'Tiburón' : 'Raya'}
					/>
					<Chip
						label='Orden'
						color={COLORS.green}
						value={found.order?.name ?? '—'}
					/>
					<Chip
						label='Familia'
						color={COLORS.orange}
						value={found.family?.name ?? '—'}
					/>
					<Chip
						label='Género'
						color={COLORS.red}
						value={found.genus?.name ?? '—'}
					/>
				</View>

				<ScrollView contentContainerStyle={styles.content}>
					<Text style={styles.stepTitle}>{stageTitle}</Text>
					<Text style={styles.stepDesc}>
						Responde a las siguientes preguntas. Cada paso tiene dos opciones. Elige la que mejor
						describa tu organismo para avanzar.
					</Text>

					{!found[stage] ? (
						currentNode ? (
							<View style={styles.card}>
								<Text style={styles.question}>{currentNode.id}. {currentNode.description}</Text>

								{currentNode.options.map((opt) => (
									<Pressable
										key={opt.code + opt.text}
										onPress={() => handlePick(opt, currentNode)}
										style={({ pressed }) => [styles.option, Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }]}
										android_ripple={{ color: COLORS.ripple }}
									>
										<Text style={styles.optionCode}>{opt.code})</Text>
										<Text style={styles.optionText}>{opt.text}</Text>
									</Pressable>
								))}

								<View style={styles.actionsRow}>
									<Pressable
										onPress={goBack}
										style={({ pressed }) => [styles.secondaryBtn, Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }]}
										android_ripple={{ color: COLORS.ripple }}
									>
										<MaterialCommunityIcons name='arrow-left' color={COLORS.mono_black3} size={18} />
										<Text style={styles.secondaryBtnText}>Atrás</Text>
									</Pressable>

									<Pressable
										onPress={resetFlow}
										style={({ pressed }) => [styles.secondaryBtn, Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }]}
										android_ripple={{ color: COLORS.ripple }}
									>
										<MaterialCommunityIcons name='restart' color={COLORS.mono_black3} size={18} />
										<Text style={styles.secondaryBtnText}>Reiniciar</Text>
									</Pressable>
								</View>
							</View>
						) : (
							<Text style={styles.info}>Cargando clave dicotómica…</Text>
						)
					) : (
						<View style={styles.resultCard}>
							<Text style={styles.resultTitle}>¡Resultado encontrado!</Text>
							<Text style={styles.resultName}>{found[stage].name}</Text>
							{found[stage].dicho_keys?.length ? (
								<Text style={styles.keys}>
									Clave: {found[stage].dicho_keys.join(' → ')}
								</Text>
							) : null}

							<View style={styles.actionsColumn}>
								<Pressable
									onPress={goBack}
									style={({ pressed }) => [styles.secondaryBtn, Platform.OS === 'ios' && { opacity: pressed ? 0.8 : 1 }]}
									android_ripple={{ color: COLORS.ripple }}
								>
									<MaterialCommunityIcons name='arrow-left' color={COLORS.mono_black3} size={18} />
									<Text style={styles.secondaryBtnText}>Cambiar respuesta</Text>
								</Pressable>

								{stage === 'order' && (
									<Pressable
										onPress={continueToFamily}
										style={({ pressed }) => [
											styles.primaryBtn,
											Platform.OS === 'ios' && { opacity: pressed ? 0.9 : 1 }
										]}
										android_ripple={{ color: COLORS.mono_medium_soft }}
									>
										<MaterialCommunityIcons name='arrow-right-circle' color={COLORS.whiteForButtons} size={20} />
										<Text style={styles.primaryBtnText}>Continuar a Familia</Text>
									</Pressable>
								)}

								{stage === 'family' && (
									<Pressable
										onPress={continueToGenus}
										style={({ pressed }) => [
											styles.primaryBtn,
											Platform.OS === 'ios' && { opacity: pressed ? 0.9 : 1 }
										]}
										android_ripple={{ color: COLORS.mono_medium_soft }}
									>
										<MaterialCommunityIcons name='arrow-right-circle' color={COLORS.whiteForButtons} size={20} />
										<Text style={styles.primaryBtnText}>Continuar a Género</Text>
									</Pressable>
								)}
							</View>
						</View>
					)}

					{answers.length > 0 && (
						<View style={styles.answersBox}>
							<Text style={styles.answersTitle}>Tus elecciones</Text>
							{answers.map((a) => (
								<Text key={`${stage}-${a.id}-${a.code}`} style={styles.answerLine}>
									<Text style={{ fontWeight: '600' }}>{a.id}{a.code} </Text>{a.text}
								</Text>
							))}
						</View>
					)}
				</ScrollView>
			</View>
		</>
	)
}

const Chip = ({ label, value, color }) => (
	<View style={chipStyles.chip}>
		<View style={chipStyles.containerHeaderItemChip}>
			<MaterialCommunityIcons name='square-rounded' size={TEXT_SIZES.medium} color={color} />
			<Text style={chipStyles.chipTitleText}>{label}</Text>
		</View>
		<Text style={chipStyles.chipText}>{value}</Text>
	</View>
)

const chipStyles = StyleSheet.create({
	chip: {
		flex: 1,
		width: '100%',
		maxWidth: '49%',
		minWidth: '40%',
		overflow: 'hidden',
		paddingVertical: 4,
		paddingHorizontal: 2,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: COLORS.white5,
		backgroundColor: COLORS.white1
	},
	containerHeaderItemChip: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		paddingHorizontal: 5
	},
	chipTitleText: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black2,
		fontWeight: '500'
	},
	chipText: {
		fontSize: TEXT_SIZES.small,
		color: COLORS.mono_black3,
		alignSelf: 'center'
	}
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.white1,
		paddingHorizontal: 15
	},
	containerHeaderBtn: {
		borderRadius: 50,
		overflow: 'hidden',
		marginRight: 5
	},
	buttonInfo: {
		padding: 10
	},
	progressBar: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 5,
		paddingTop: 5,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.white5
	},
	content: {
		paddingVertical: 15,
		gap: 8
	},
	stepTitle: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_black3,
		fontWeight: 'bold'
	},
	stepDesc: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3
	},
	card: {
		marginTop: 12,
		marginBottom: 5,
		padding: 12,
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 5,
		backgroundColor: COLORS.white1,
		gap: 8
	},
	question: {
		lineHeight: TEXT_SIZES.medium + 2,
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black2,
		fontWeight: '600',
		marginBottom: 5
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 5,
		backgroundColor: COLORS.white1
	},
	optionCode: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black2,
		fontWeight: '600'
	},
	optionText: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3
	},
	actionsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 8,
		marginTop: 5
	},
	actionsColumn: {
		gap: 8,
		marginTop: 5
	},
	secondaryBtn: {
		flex: 1,
		flexDirection: 'row',
		gap: 6,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: COLORS.white5,
		backgroundColor: COLORS.white1,
	},
	secondaryBtnText: {
		color: COLORS.mono_black3,
		fontSize: TEXT_SIZES.medium,
		fontWeight: '500'
	},
	primaryBtn: {
		flex: 1,
		flexDirection: 'row',
		gap: 6,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
		borderRadius: 5,
		backgroundColor: COLORS.mono_dark
	},
	primaryBtnText: {
		color: COLORS.whiteForButtons,
		fontSize: TEXT_SIZES.medium,
		fontWeight: '500'
	},
	resultCard: {
		marginTop: 12,
		padding: 12,
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 5,
		backgroundColor: COLORS.white1,
		gap: 6,
		marginBottom: 5
	},
	resultTitle: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_black2,
		fontWeight: '600'
	},
	resultName: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_black3,
		fontWeight: '700',
		fontStyle: 'italic'
	},
	keys: {
		fontSize: TEXT_SIZES.medium,
		color: COLORS.mono_black3
	},
	answersBox: {
		padding: 12,
		borderWidth: 1,
		borderColor: COLORS.white5,
		borderRadius: 5,
		backgroundColor: COLORS.white1,
		gap: 6
	},
	answersTitle: {
		fontSize: TEXT_SIZES.medium,
		fontWeight: '600',
		color: COLORS.mono_black2
	},
	answerLine: {
		color: COLORS.mono_black3,
		fontSize: TEXT_SIZES.medium
	}
})
