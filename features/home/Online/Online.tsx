import TextC from "@ui/TextC";
import { Flex } from "@ui/Flex";
import { useOnlineUsers } from "@hooks/useOnlineUsers";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { ActivityIndicator } from "react-native-paper";
import { formatCutText } from "utils/formatter";

export default function Online() {
 const { data } = useOnlineUsers();
 return (
  <Flex
   gap={20}
   className="bg-[#1a1a1a] mt-10 rounded-xl w-full p-4 "
   direction="column"
  >
   <Flex align="center" gap={8}>
    <TextC size={18} weight="bold">
     Сейчас онлайн ({data?.length ?? 0})
    </TextC>
   </Flex>
   <Flex>
    {data ? (
     <FlatList
      horizontal
      data={data}
      contentContainerClassName="gap-4"
      renderItem={({ item }) => (
       <Flex direction="column" align="center">
        <Flex className="relative overflow-hidden">
         <Image
          source={{
           uri: `https://k-connect.ru${item.photo}`,
          }}
          className="rounded-full overflow-hidden"
          style={{
           height: 50,
           width: 50,
           borderRadius: 900,
          }}
         />
        </Flex>
        <TextC weight="bold" size={13}>
         {formatCutText(item.name, 5)}
        </TextC>
       </Flex>
      )}
     />
    ) : (
     <ActivityIndicator className="w-full justify-center flex" />
    )}
   </Flex>
  </Flex>
 );
}
