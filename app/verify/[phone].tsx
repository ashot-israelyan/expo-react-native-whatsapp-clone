import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Colors from '@/constants/Colors';

const CELL_COUNT = 6;

const Page = () => {
	const [code, setCode] = useState('');
	const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

	const { phone, signin } = useLocalSearchParams<{ phone: string; signin: string }>();
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value: code,
		setValue: setCode,
	});

	const verifyCode = async () => {};

	const verifySignIn = async () => {};

	const resendCode = async () => {};

	useEffect(() => {
		if (code.length === 6) {
			if (signin === 'true') {
				verifySignIn();
			} else {
				verifyCode();
			}
		}
	}, [code]);

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerTitle: phone }} />
			<Text style={styles.legal}>We have sent you an SMS with a code to the number above.</Text>
			<Text style={styles.legal}>
				To complete your phone number verification, please enter the 6-digit activation code.
			</Text>

			<CodeField
				ref={ref}
				{...props}
				value={code}
				onChangeText={setCode}
				cellCount={CELL_COUNT}
				rootStyle={styles.codeFieldRoot}
				keyboardType="number-pad"
				textContentType="oneTimeCode"
				renderCell={({ index, symbol, isFocused }) => (
					<View
						onLayout={getCellOnLayoutHandler(index)}
						key={index}
						style={[styles.cellRoot, isFocused && styles.focusCell]}
					>
						<Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
					</View>
				)}
			/>

			<TouchableOpacity style={styles.button}>
				<Text style={styles.buttonText}>Didn't receive a verification code?</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 20,
		backgroundColor: Colors.background,
		gap: 20,
	},
	legal: {
		fontSize: 14,
		textAlign: 'center',
		color: '#000',
	},
	button: {
		width: '100%',
		alignItems: 'center',
	},
	buttonText: {
		color: Colors.primary,
		fontSize: 18,
	},
	codeFieldRoot: {
		marginTop: 20,
		width: 260,
		marginLeft: 'auto',
		marginRight: 'auto',
		gap: 4,
	},
	cellRoot: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	cellText: {
		color: '#000',
		fontSize: 36,
		textAlign: 'center',
	},
	focusCell: {
		paddingBottom: 4,
		borderBottomColor: '#000',
		borderBottomWidth: 2,
	},
});

export default Page;
