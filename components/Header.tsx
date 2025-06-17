import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { router } from "expo-router";
import { FC } from "react";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";

type Props = {
 text: string;
};

export const Header: FC<Props> = ({ text }) => {
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
    {text}
   </TextC>
  </Flex>
 );
};
