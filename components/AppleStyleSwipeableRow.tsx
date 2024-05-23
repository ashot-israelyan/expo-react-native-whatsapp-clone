import Swipeable from 'react-native-gesture-handler/Swipeable';
import { FC, PropsWithChildren, useRef } from 'react';
import { Alert, Animated, I18nManager, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const AppleStyleSwipeableRow: FC<PropsWithChildren> = ({ children }) => {
	const swipeableRef = useRef<Swipeable | null>(null);

	const close = () => {
		swipeableRef.current?.close();
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

			Alert.alert(text);
		};

		return (
			<Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
				<RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
					<Ionicons
						name={text === 'More' ? 'ellipsis-horizontal' : 'archive'}
						size={24}
						color={'#fff'}
						style={{ paddingTop: 10 }}
					/>
					<Text style={styles.actionText}>{text}</Text>
				</RectButton>
			</Animated.View>
		);
	};

	const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => (
		<View
			style={{
				width: 192,
				flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
			}}
		>
			{renderRightAction('More', '#C8C7CD', 192, progress)}
			{renderRightAction('Archive', Colors.muted, 128, progress)}
		</View>
	);

	return (
		<Swipeable
			ref={swipeableRef}
			friction={2}
			enableTrackpadTwoFingerGesture
			rightThreshold={40}
			renderRightActions={renderRightActions}
			onSwipeableOpen={(direction) => {
				console.log(`Opening swipeable from the ${direction}`);
			}}
			onSwipeableClose={(direction) => {
				console.log(`Closing swipeable to the ${direction}`);
			}}
		>
			{children}
		</Swipeable>
	);
};

const styles = StyleSheet.create({
	leftAction: {
		flex: 1,
		backgroundColor: '#497AFC',
		justifyContent: 'center',
	},
	actionText: {
		color: 'white',
		fontSize: 16,
		backgroundColor: 'transparent',
		padding: 10,
	},
	rightAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
});

export default AppleStyleSwipeableRow;
