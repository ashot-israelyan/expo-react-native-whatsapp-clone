import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const Page = () => {
	const [code, setCode] = useState('');

	const { phone, signin } = useLocalSearchParams<{ phone: string; signin: string }>();

	return <View></View>;
};

export default Page;
