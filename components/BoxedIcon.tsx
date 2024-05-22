import { View } from 'react-native';
import { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type BoxedIconProps = {
	name: typeof Ionicons.defaultProps;
	backgroundColor: string;
};

const BoxedIcon: FC<BoxedIconProps> = ({ name, backgroundColor }) => {
	return (
		<View style={{ backgroundColor, padding: 4, borderRadius: 6 }}>
			<Ionicons name={name} size={22} color="white" />
		</View>
	);
};

export default BoxedIcon;
