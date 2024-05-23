import { FlatList, ScrollView, View } from 'react-native';
import chats from '@/assets/data/chats.json';
import ChatRow from '@/components/ChatRow';
import { defaultStyles } from '@/constants/Styles';

const Page = () => {
	return (
		<ScrollView
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle={{ paddingBottom: 40 }}
		>
			<FlatList
				scrollEnabled={false}
				data={chats}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={() => (
					<View style={[defaultStyles.separator, { marginLeft: 90 }]} />
				)}
				renderItem={({ item }) => <ChatRow {...item} />}
			/>
		</ScrollView>
	);
};

export default Page;
