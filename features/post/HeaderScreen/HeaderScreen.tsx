import { Pressable, StyleSheet } from "react-native";
import { Flex } from "@ui/Flex";
import { Icon } from "react-native-paper";
import TextC from "@ui/TextC";
import { router } from "expo-router";

export default function HeaderScreen() {
 return (
  <Flex
   align="center"
   gap={20}
   className="p-4 border-b border-[#1e1f20] rounded-b-xl"
  >
   <Pressable onPress={() => router.back()}>
    <Icon source={"arrow-left"} color="#fff" size={24} />
   </Pressable>
   <TextC size={20} weight="bold">
    Пост
   </TextC>
  </Flex>
 );
}
