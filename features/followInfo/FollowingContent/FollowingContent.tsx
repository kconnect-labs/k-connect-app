import { useFollowing } from "@hooks/useFollowing";
import Avatar from "@ui/Avatar";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Icon } from "react-native-paper";
import { buildImageUrl } from "utils/urlUtils";

export default function FollowingContent() {
 const { data, refetch } = useFollowing();
 const [refreshing, setRefreshing] = useState(false);

 const onRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
 };
 return (
  <Flex direction="column" className="w-full" align="center" gap={10}>
   <TextC weight="bold" className="mt-5 opacity-50">
    Количество: {data?.following.length}
   </TextC>
   <FlatList
    data={data?.following}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={{ paddingBottom: 120, gap: 1 }}
    refreshing
    refreshControl={
     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    renderItem={({ item: friend }) => (
     <Flex
      align="center"
      className="w-[98%] p-4 bg-[#262626] rounded-xl mb-4 self-center"
      justify="space-between"
     >
      <Flex gap={6}>
       <Avatar
        userId={friend.id}
        size={18}
        image={{
         uri: buildImageUrl(friend.avatar_url),
        }}
       />
       <Flex direction="column">
        <TextC weight="bold">{friend.name}</TextC>
        <TextC weight="medium" size={12} className="opacity-50">
         Нет описания
        </TextC>
       </Flex>
      </Flex>
      <Flex>
       <Icon source="account-plus" size={22} color="#d0bcff" />
      </Flex>
     </Flex>
    )}
   />
  </Flex>
 );
}
