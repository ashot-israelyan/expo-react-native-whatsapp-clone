import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Linking,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskInput from 'react-native-mask-input';
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import type { PhoneCodeFactor } from '@clerk/types/dist/factors';

const ARM_PHONE = [`+`, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

const Page = () => {
	const [loading, setLoading] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState('');

	const router = useRouter();
	const { bottom } = useSafeAreaInsets();
	const { signUp, setActive } = useSignUp();
	const { signIn } = useSignIn();

	const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

	const openLink = () => {
		Linking.openURL('https://www.whatsapp.com/legal/');
	};

	const trySignIn = async () => {
		const { supportedFirstFactors } = await signIn!.create({
			identifier: phoneNumber,
		});

		const firstPhoneFactor = supportedFirstFactors.find((factor) => {
			return factor.strategy === 'phone_code';
		}) as PhoneCodeFactor | undefined;

		if (!firstPhoneFactor) return;

		const { phoneNumberId } = firstPhoneFactor;

		await signIn!.prepareFirstFactor({
			strategy: 'phone_code',
			phoneNumberId,
		});

		router.push(`/verify/${phoneNumber}?signin=true`);
		setLoading(false);
	};

	const sendOTP = async () => {
		setLoading(true);
		try {
			await signUp!.create({ phoneNumber });

			signUp!.preparePhoneNumberVerification();

			router.push(`/verify/${phoneNumber}`);
		} catch (err) {
			console.log(err);
			if (isClerkAPIResponseError(err)) {
				if (err.errors[0].code === 'form_identifier_exists') {
					console.log('user exists');

					await trySignIn();
				} else {
					setLoading(false);
					Alert.alert('Error', err.errors[0].message);
				}
			}
		}
	};

	return (
		<KeyboardAvoidingView
			keyboardVerticalOffset={keyboardVerticalOffset}
			style={{ flex: 1 }}
			behavior="padding"
		>
			{loading && (
				<View style={[StyleSheet.absoluteFill, styles.loading]}>
					<ActivityIndicator size="large" color={Colors.primary} />
					<Text style={{ fontSize: 18, padding: 10 }}>Sending code...</Text>
				</View>
			)}
			<View style={styles.container}>
				<Text style={styles.description}>
					WhatsApp will need to verify your account. Carrier charges may apply.
				</Text>

				<View style={styles.list}>
					<View style={styles.listItem}>
						<Text style={styles.listItemText}>Armenia</Text>
						<Ionicons name="chevron-forward" size={20} color={Colors.gray} />
					</View>
					<View style={styles.separator} />

					<MaskInput
						value={phoneNumber}
						keyboardType="numeric"
						autoFocus
						placeholder="+374 your phone number"
						onChangeText={(masked, unmasked) => {
							setPhoneNumber(masked);
						}}
						mask={ARM_PHONE}
						style={styles.input}
					/>
				</View>

				<Text style={styles.legal}>
					You must be{' '}
					<Text style={styles.link} onPress={openLink}>
						at least 16 years old
					</Text>{' '}
					to register. Learn how WhatsApp works with the{' '}
					<Text style={styles.link} onPress={openLink}>
						Meta Companies
					</Text>
					.
				</Text>

				<View style={{ flex: 1 }} />

				<TouchableOpacity
					onPress={sendOTP}
					style={[
						styles.button,
						phoneNumber !== '' ? styles.enabled : null,
						{ marginBottom: bottom },
					]}
					disabled={!phoneNumber}
				>
					<Text style={[styles.buttonText, phoneNumber !== '' ? styles.enabled : null]}>Next</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
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
	description: {
		fontSize: 14,
		color: Colors.gray,
	},
	legal: {
		fontSize: 12,
		textAlign: 'center',
		color: '#000',
	},
	link: {
		color: Colors.primary,
	},
	button: {
		width: '100%',
		alignItems: 'center',
		backgroundColor: Colors.disabled,
		padding: 10,
		borderRadius: 10,
	},
	enabled: {
		backgroundColor: Colors.primary,
		color: '#fff',
	},
	buttonText: {
		color: Colors.gray,
		fontSize: 22,
		fontWeight: '500',
	},
	list: {
		backgroundColor: '#fff',
		width: '100%',
		borderRadius: 10,
		padding: 10,
	},
	listItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 6,
		marginBottom: 10,
	},
	listItemText: {
		fontSize: 18,
		color: Colors.primary,
	},
	separator: {
		width: '100%',
		height: 1,
		backgroundColor: Colors.gray,
		opacity: 0.2,
	},
	input: {
		backgroundColor: '#fff',
		width: '100%',
		fontSize: 16,
		padding: 6,
		marginTop: 10,
	},
	loading: {
		zIndex: 10,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Page;
