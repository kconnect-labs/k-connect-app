import Badge from "@ui/Badge";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { useMemo } from "react";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Icon } from "react-native-paper";
import { useModalStore } from "stores/modalStore";
import { Root } from "types/profile";
import ModalHistoryUsername from "./components/ModalHistoryUsername";

const ProfileInfo = ({ data }: { data: Root | null }) => {
 const { openModal } = useModalStore();

 const renderedUsernames = useMemo(() => {
  return data?.user?.purchased_usernames?.map((username) => {
   const color = username.is_active
    ? { badge: "#d0bcff", text: "#fff" }
    : { badge: "#363638", text: "#ccc" };
   return (
    <Pressable
     key={username.id}
     className="w-full"
     onPress={() => openModal(<ModalHistoryUsername data={username} />, "")}
    >
     <Badge key={username.id} color={color.badge}>
      <TextC color={color.text} size={11}>
       @{username.username}
      </TextC>
     </Badge>
    </Pressable>
   );
  });
 }, [data?.user?.purchased_usernames]);

 return (
  <Flex
   direction="column"
   gap={16}
   className="bg-[#1e1f20] rounded-xl w-full p-3"
   style={{ maxWidth: '100%', overflow: 'hidden' }}
  >
   <Flex direction="row" align="flex-start" gap={6}>
    <Icon source={"information"} size={22} color="#d0bcff" />
    <Flex direction="column" gap={4} flex={1}>
     <TextC color="#ffffff80" size={12}>Обо мне</TextC>
     {data?.user.about && <TextC size={13}>{data?.user.about}</TextC>}
    </Flex>
   </Flex>
   <View className="w-full h-0.5 bg-[#292a2b]" />
   <Flex direction="row" align="flex-start" gap={6}>
    <Icon source={"calendar"} size={22} color="#d0bcff" />
    <Flex direction="column" gap={4} flex={1}>
     <TextC color="#ffffff80" size={12}>Дата регистрации</TextC>
     <TextC size={13}>
      {new Date(data?.user.registration_date || 0).toLocaleString("ru-RU", {
       day: "numeric",
       month: "long",
       year: "numeric",
      })}
     </TextC>
    </Flex>
   </Flex>
   <Flex direction="row" align="flex-start" gap={6}>
    <Icon source={"at"} size={22} color="#d0bcff" />
    <Flex direction="column" gap={4} flex={1}>
     <TextC color="#ffffff80" size={12}>Юзернеймы</TextC>
     <Flex direction="row" className="flex-wrap" gap={3}>
      {renderedUsernames}
     </Flex>
    </Flex>
   </Flex>
  </Flex>
 );
};

export default ProfileInfo;
