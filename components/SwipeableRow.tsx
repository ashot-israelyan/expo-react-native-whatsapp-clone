import { FC, PropsWithChildren, useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

const SwipeableRow: FC<PropsWithChildren<{ onDelete: () => void }>> = ({ children, onDelete }) => {
	const swipeableRef = useRef<Swipeable | null>(null);

	const close = () => {
		swipeableRef.current?.close();
		onDelete();
	};

	const onSwipeableOpen = () => {
		close();
	};

	const renderRightAction = (
		text: string,
		color: string,
		x: number,
		progress: Animated.AnimatedInterpolation<number>,
	) => {
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [x, 0],
		});

		const pressHandler = () => {
			close();
		};

		return (
			<Animated.View
				style={{
					flex: 1,
					transform: [{ translateX: trans }],
				}}
			>
				<RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
					<Text style={styles.actionText}>{text}</Text>
				</RectButton>
			</Animated.View>
		);
	};

	const renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		_dragAnimatedValue: Animated.AnimatedInterpolation<number>,
	) => (
		<View
			style={{
				width: 300,
				flexDirection: 'row',
			}}
		>
			{renderRightAction('Delete', '#dd2c00', 300, progress)}
		</View>
	);

	return (
		<Swipeable
			ref={swipeableRef}
			enableTrackpadTwoFingerGesture
			friction={1.4}
			overshootRight={false}
			rightThreshold={140}
			renderRightActions={renderRightActions}
			onSwipeableOpen={onSwipeableOpen}
		>
			{children}
		</Swipeable>
	);
};

const styles = StyleSheet.create({
	actionText: {
		color: 'white',
		fontSize: 16,
		backgroundColor: 'transparent',
		padding: 10,
		alignSelf: 'flex-start',
	},
	rightAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
});

export default SwipeableRow;
