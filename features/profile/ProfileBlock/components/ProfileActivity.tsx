import { Root } from "types/profile";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useModalStore } from "stores/modalStore";

const ProfileActivity = React.memo(({ data }: { data: Root | null }) => {
 return (
  <Flex align="center" gap={6} className="w-full" justify="space-between">
   <Flex
    direction="column"
    gap={2}
    className="w-1/3 bg-[#242424] py-2 px-1 border-[1px] border-[#292a2b] flex-1 rounded-2xl"
   >
    <TextC
     color={data?.user.status_color}
     weight="bold"
     className="text-center w-full"
     size={16}
    >
     {data?.posts_count ?? 0}
    </TextC>
    <TextC className="text-center w-full" size={12}>
     публикаций
    </TextC>
   </Flex>
   <Pressable
    className="w-1/3"
    // onPress={() => router.push("/")}
   >
    <Flex
     direction="column"
     gap={2}
     className="bg-[#242424] py-2 px-1 border-[1px] border-[#292a2b] flex-1 rounded-2xl"
    >
     <TextC
      color={data?.user.status_color}
      weight="bold"
      className="text-center w-full"
      size={16}
     >
      {data?.friends_count ?? 0}
     </TextC>
     <TextC className="text-center w-full" size={12}>
      Друзей
     </TextC>
    </Flex>
   </Pressable>
   <Pressable
    className="w-1/3"
    onPress={() => {
     //  router.push("/profile/followinfo");
    }}
   >
    <Flex
     direction="column"
     gap={2}
     className="bg-[#242424] py-2 px-1 border-[1px] border-[#292a2b] flex-1 rounded-2xl"
    >
     <TextC
      color={data?.user.status_color}
      weight="bold"
      className="text-center w-full"
      size={16}
     >
      {data?.following_count ?? 0}
     </TextC>
     <TextC className="text-center w-full" size={12}>
      Подписок
     </TextC>
    </Flex>
   </Pressable>
  </Flex>
 );
});

export default ProfileActivity;
