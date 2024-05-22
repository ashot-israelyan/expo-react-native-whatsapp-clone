import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import { defaultStyles } from '@/constants/Styles';
import BoxedIcon from '@/components/BoxedIcon';
import { Ionicons } from '@expo/vector-icons';
import Settings from '@/constants/Settings';

const Page = () => {
	const { signOut } = useAuth();

	return (
		<View style={{ flex: 1, backgroundColor: Colors.background }}>
			<ScrollView contentInsetAdjustmentBehavior="automatic">
				{Object.entries(Settings).map(([key, items]) => (
					<View key={key} style={defaultStyles.block}>
						<FlatList
							data={items}
							scrollEnabled={false}
							ItemSeparatorComponent={() => <View style={defaultStyles.separator} />}
							renderItem={({ item }) => (
								<View style={defaultStyles.item}>
									<BoxedIcon name={item.icon} backgroundColor={item.backgroundColor} />
									<Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
									<Ionicons name="chevron-forward" size={20} color={Colors.gray} />
								</View>
							)}
						/>
					</View>
				))}

				<TouchableOpacity onPress={() => signOut()}>
					<Text
						style={{
							color: Colors.primary,
							fontSize: 18,
							textAlign: 'center',
							paddingVertical: 14,
						}}
					>
						Log Out
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

export default Page;
