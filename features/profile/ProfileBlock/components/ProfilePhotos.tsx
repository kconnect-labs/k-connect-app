import { View, Image } from "react-native";
import { Flex } from "@ui/Flex";
import { Root } from "types/profile";
import React from "react";

const ProfilePhotos = React.memo(({ data }: { data: Root | null }) => {
 return (
  <Flex direction="column">
   <Flex className="w-full">
    <Image
     source={{
      uri: `https://k-connect.ru${data?.user?.banner_url}`,
      cache: "force-cache",
     }}
     style={{ height: 120, width: "100%" }}
    />
   </Flex>

   <Flex className="mt-[-50px] ml-3 relative">
    <Image
     source={{
      uri: `https://k-connect.ru${data?.user?.avatar_url}`,
      cache: "force-cache",
     }}
     className="rounded-full "
     style={{
      height: 100,
      width: 100,
      borderWidth: 2,
      borderColor: data?.user?.status_color,
     }}
    />
    {/* STATUS ONLINE */}
    <View className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-[1px] border-black rounded-full" />
   </Flex>
  </Flex>
 );
});
export default ProfilePhotos;
