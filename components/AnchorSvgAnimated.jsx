import { Animated } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const AnimatedPath = Animated.createAnimatedComponent(Path)

const MantaSvg = ({ width, height, color, strokeColor, opacityStroke = 0, ...props }) => {
  	return (
		<Svg
			height={height}
			width={width}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 64 64'
			xmlSpace='preserve'
			{...props}
		>
			<AnimatedPath
				d='M58.39 25.13C51.15 16.77 37.99 16 37.99 16h-.1c1 0 1.92-.68 2.08-1.66.2-1.25-.76-2.34-1.97-2.34V8.11c0-1-.68-1.92-1.66-2.08C35.09 5.83 34 6.79 34 8v2c0 1.1-.9 2-2 2s-2-.9-2-2V8.11c0-1-.68-1.92-1.66-2.08C27.09 5.83 26 6.79 26 8v4a2 2 0 00-1.97 2.34c.16.98 1.08 1.66 2.08 1.66h-.1s-13.15.77-20.4 9.13c-1.29 1.49-.4 3.85 1.56 4.05 6.18.63 17.72 2.36 23.83 12.92v.9c0 9.37 7.63 17 17 17 .55 0 1-.45 1-1s-.45-1-1-1c-8.27 0-15-6.73-15-15v-.9c6.11-10.56 17.65-12.3 23.83-12.92 1.97-.2 2.86-2.55 1.56-4.05zM24 24c0 .55-.45 1-1 1s-1-.45-1-1c0-2.21 1.79-4 4-4 .55 0 1 .45 1 1s-.45 1-1 1c-1.1 0-2 .9-2 2zm3 3c0 .55-.45 1-1 1s-1-.45-1-1c0-2.21 1.79-4 4-4 .55 0 1 .45 1 1s-.45 1-1 1c-1.1 0-2 .9-2 2zm8 9c0 .55-.45 1-1 1s-1-.45-1-1v-1c0-.55-.45-1-1-1s-1 .45-1 1v1c0 .55-.45 1-1 1s-1-.45-1-1v-1c0-1.65 1.35-3 3-3s3 1.35 3 3v1zm3-8c-.55 0-1-.45-1-1 0-1.1-.9-2-2-2-.55 0-1-.45-1-1s.45-1 1-1c2.21 0 4 1.79 4 4 0 .55-.45 1-1 1zm3-3c-.55 0-1-.45-1-1 0-1.1-.9-2-2-2-.55 0-1-.45-1-1s.45-1 1-1c2.21 0 4 1.79 4 4 0 .55-.45 1-1 1z'
				fill={color}
				stroke={strokeColor}
				strokeOpacity={opacityStroke}
				strokeWidth={1}
				strokeLinecap='round'
			/>
		</Svg>
  	)
}

export default MantaSvg
