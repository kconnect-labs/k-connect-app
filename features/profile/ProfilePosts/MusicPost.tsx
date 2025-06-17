import { View, Text, Image } from "react-native";
import React from "react";
import { Post } from "types/posts";
import { Flex } from "@ui/Flex";
import { Icon } from "react-native-paper";
import TextC from "@ui/TextC";
import { formatDuration } from "utils/formatter";
import { TypesPost } from "features/post/PostComponent/PostComponent";

const MusicPost = ({ item }: { item: TypesPost }) => {
 return (
  item.music && (
   <Flex
    direction="row"
    gap={2}
    align="center"
    justify="space-between"
    className="mt-4 px-4 py-2 bg-[#1e1f20] w-full rounded-xl border-[1px] border-[#363638]"
   >
    <Flex align="center" gap={6}>
     <View>
      <View className="absolute top-1 left-1">
       <Icon source="play" size={16} color="#fff" />
      </View>
      <Image
       source={{ uri: `https://k-connect.ru${item.music[0].cover_path}` }}
       style={{
        height: 25,
        width: 25,
        borderRadius: 5,
        resizeMode: "cover",
        opacity: 0.3,
       }}
      />
     </View>
     <Flex direction="column">
      <TextC className="text-[#b0bec5]" size={14}>
       {item.music[0].title}
      </TextC>
      <TextC className="text-[#b0bec5]" size={10}>
       {item.music[0].artist}
      </TextC>
     </Flex>
    </Flex>
    <TextC className="text-[#b0bec5] opacity-50" size={12}>
     {formatDuration(item.music[0].duration)}
    </TextC>
   </Flex>
  )
 );
};

export default MusicPost;
