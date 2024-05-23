import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { View } from 'react-native';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
	async getToken(key: string) {
		try {
			return SecureStore.getItemAsync(key);
		} catch (err) {
			return null;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (err) {
			return;
		}
	},
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
	const router = useRouter();
	const segments = useSegments();
	const { isLoaded, isSignedIn } = useAuth();

	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded && isLoaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded, isLoaded]);

	useEffect(() => {
		if (isLoaded) {
			const inTabsGroup = segments[0] === '(tabs)';

			if (isSignedIn && !inTabsGroup) {
				router.replace('/(tabs)/calls');
			} else if (!isSignedIn) {
				router.replace('/');
			}
		}
	}, [isLoaded, isSignedIn, router, segments]);

	if (!loaded || !isLoaded) {
		return <View />;
	}

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen
				name="otp"
				options={{ headerTitle: 'Enter Your Phone Number', headerBackVisible: false }}
			/>
			<Stack.Screen
				name="verify/[phone]"
				options={{ headerTitle: 'Verify Your Phone Number', headerBackTitle: 'Edit number' }}
			/>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
};

const RootLayout = () => {
	return (
		<ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY!}>
			<InitialLayout />
		</ClerkProvider>
	);
};

export default RootLayout;
