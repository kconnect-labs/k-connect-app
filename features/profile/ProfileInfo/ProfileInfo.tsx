import { View } from "react-native";
import { Root } from "types/profile";
import { Flex } from "@ui/Flex";
import { Icon } from "react-native-paper";
import TextC from "@ui/TextC";
import Badge from "@ui/Badge";
import { useMemo } from "react";
import { Pressable } from "react-native-gesture-handler";
import { useModalStore } from "stores/modalStore";
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
      <TextC color={color.text} size={12}>
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
   gap={20}
   className="bg-[#1e1f20] rounded-xl w-full p-4"
  >
   <Flex direction="row" align="flex-start" gap={6}>
    <Icon source={"information"} size={24} color="#d0bcff" />
    <Flex direction="column" gap={6} flex={1}>
     <TextC color="#ffffff80">Обо мне</TextC>
     {data?.user.about && <TextC>{data?.user.about}</TextC>}
    </Flex>
   </Flex>
   <View className="w-full h-0.5 bg-[#292a2b]" />
   <Flex direction="row" align="flex-start" gap={6}>
    <Icon source={"calendar"} size={24} color="#d0bcff" />
    <Flex direction="column" gap={6} flex={1}>
     <TextC color="#ffffff80">Дата регистрации</TextC>
     <TextC>
      {new Date(data?.user.registration_date || 0).toLocaleString("ru-RU", {
       day: "numeric",
       month: "long",
       year: "numeric",
      })}
     </TextC>
    </Flex>
   </Flex>
   <Flex direction="row" align="flex-start" gap={6}>
    <Icon source={"at"} size={24} color="#d0bcff" />
    <Flex direction="column" gap={6} flex={1}>
     <TextC color="#ffffff80">Юзернеймы</TextC>
     <Flex direction="row" className="flex-wrap" gap={4}>
      {renderedUsernames}
     </Flex>
    </Flex>
   </Flex>
  </Flex>
 );
};

export default ProfileInfo;
