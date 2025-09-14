import { Dimensions, PixelRatio, StyleSheet } from "react-native"

const FONT_SCALE = PixelRatio.getFontScale()
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

const COLORS = Object.freeze({
	shadow_dark: '#19191950',
	background_modal: "#202a2c70",

	mono_black1: '#001416',
	mono_black2: '#002222',
	mono_black3: '#003030',

	mono_gray1: '#4e585a',

	white1: '#ffffff',
	white2: '#f5f5f5',
	white3: '#f9f9f9',
	white4: '#e0e0e0',
	white5: '#c0c4c5',

	whiteForButtons: '#f2f2f2',

	primary1: '#00cdeb',
	primary1_soft: '#00cdeb70',
	primary1_soft1: '#00cdeb10',
	primary1_soft2: '#00cdeb06',

	mono_dark: '#003941',
	mono_medium: '#008396',
	mono_medium_soft: '#00839650',

	ripple: '#00394115',

	//alert colors
	green: '#00E676',
	green_highlight: '#00C853',
	red: '#FF595A',
	red_highlight: '#DE2340',
	orange: '#FFA94D',
	orange_highlight: '#FC883A',
	blue: '#00B0FF',
	blue_highlight: '#0091EA'
})

const TEXT_SIZES = Object.freeze({
	verySmall: Math.min(WIDTH, HEIGHT) / 35 / FONT_SCALE,
	small: Math.min(WIDTH, HEIGHT) / 30 / FONT_SCALE,
	medium: Math.min(WIDTH, HEIGHT) / 27 / FONT_SCALE,
	big: Math.min(WIDTH, HEIGHT) / 23 / FONT_SCALE,
	veryBig: Math.min(WIDTH, HEIGHT) / 16 / FONT_SCALE,

	icon_big: Math.min(WIDTH, HEIGHT) / 8
})

const textStyles = StyleSheet.create({
	titlePage: {
		fontSize: TEXT_SIZES.big,
		color: COLORS.mono_black1,
		fontWeight: 'bold'
	},
	titleItem: {
		fontSize: TEXT_SIZES.big,
		lineHeight: TEXT_SIZES.big,
		color: COLORS.mono_black1,
		fontWeight: '500'
	},
})

export { COLORS, TEXT_SIZES, textStyles }

