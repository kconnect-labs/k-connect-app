import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { router } from "expo-router";
import { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";

type Props = {
 text: string;
};

export const Header: FC<Props> = ({ text }) => {
 return (
  <Flex
   align="center"
   gap={20}
   style={styles.header}
  >
   <Pressable onPress={() => router.back()} style={styles.backButton}>
    <Icon source={"arrow-left"} color="#fff" size={24} />
   </Pressable>
   <TextC size={20} weight="bold" style={styles.title}>
    {text}
   </TextC>
  </Flex>
 );
};

const styles = StyleSheet.create({
 header: {
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#1e1f20",
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
  backgroundColor: "#242229",
 },
 backButton: {
  padding: 4,
 },
 title: {
  flex: 1,
  textAlign: 'center',
 },
});
