import { Flex } from "@ui/Flex";
import { Root } from "types/profile";
import { Pressable, Alert } from "react-native";
import { SvgUri } from "react-native-svg";
import { formatStatus } from "utils/formatter";
import { SVG_CHECK_CIRCLE } from "assets/svg/svg";
import TextC from "@ui/TextC";
import { Image } from "expo-image";
import React from "react";

const ProfileIdentity = React.memo(({ data }: { data: Root }) => {
 return (
  <Flex align="center" gap={4}>
   <TextC size={18} weight="bold">
    {data?.user?.name}
   </TextC>
   <Pressable
    onLongPress={() => {
     const timer = setTimeout(() => {
      Alert.alert(`${data?.verification?.date}`);
     }, 800);
     return () => clearTimeout(timer);
    }}
   >
    {data.verification && (
     <SVG_CHECK_CIRCLE fill={formatStatus(data?.verification?.status ?? 0)} />
    )}
   </Pressable>
   {data?.achievement?.image_path?.endsWith(".svg") ? (
    <SvgUri
     uri={`https://k-connect.ru/static/images/bages/${data?.achievement?.image_path}`}
     width={20}
     height={20}
    />
   ) : (
    <Image
     source={`https://k-connect.ru/static/images/bages/${data?.achievement?.image_path}`}
     style={{ width: 20, height: 20 }}
    />
   )}
  </Flex>
 );
});

export default ProfileIdentity;
