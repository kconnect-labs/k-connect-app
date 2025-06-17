import { Pressable } from "react-native";
import { Flex } from "@ui/Flex";
import { Icon } from "react-native-paper";
import TextC from "@ui/TextC";
import * as Clipboard from "expo-clipboard";
import { useNotifyStore } from "stores/notifyStore";
import { router } from "expo-router";
import { TypesPost } from "features/post/PostComponent/PostComponent";
import { useLike } from "@hooks/useLike";
import { useState } from "react";

const FooterPost = ({ item }: { item: TypesPost }) => {
 const [isLikePost, setIsLikePost] = useState<boolean>(item.is_liked);
 const [totalLikes, setTotalLikes] = useState<number>(item.likes_count);
 const { likePost } = useLike();
 const handleLikePost = (postId: number) => {
  likePost({ postId }).then((reponse) => {
   if (!reponse) return;
   setTotalLikes(reponse.likes_count);
   setIsLikePost(reponse.liked);
  });
 };
 return (
  <Flex className="mt-4 w-full" justify="space-between" align="center">
   <Flex gap={6} align="center">
    <Flex
     direction="row"
     className="rounded-full overflow-hidden border-[1px] border-[#363638]"
    >
     <Pressable onPress={() => handleLikePost(item.id)}>
      <Flex
       direction="row"
       gap={2}
       align="center"
       className="px-4 py-2"
       style={{ backgroundColor: item.is_liked ? "#443d5590" : "#363638" }}
      >
       <Icon
        source="heart"
        size={16}
        color={isLikePost ? "#d0bcff" : "#b0bec5"}
       />
       <TextC className="text-[#d0bcff]" size={14}>
        {totalLikes}
       </TextC>
      </Flex>
     </Pressable>
     <Pressable
      onPress={() =>
       //  router.push({
       //   pathname: `/profile/post/[post]`,
       //   params: { id: item.id },
       //  })
       {}
      }
     >
      <Flex
       direction="row"
       gap={2}
       align="center"
       className="px-4 py-2 border-l-[1px] border-[#2c2c2c] bg-[#363638]"
      >
       <Icon source="comment" size={16} color="#b0bec5" />
       <TextC className="text-[#b0bec5]" size={14}>
        {item.comments_count}
       </TextC>
      </Flex>
     </Pressable>
    </Flex>
    <Pressable
     onPress={() => {
      Clipboard.setStringAsync(`https://k-connect.ru/post/${item.id}`);
      useNotifyStore.getState().show({
       message: "Ссылка скопирована",
       icon: "content-copy",
       color: "#d0bcff",
       duration: 3000,
      });
     }}
    >
     <Flex
      direction="row"
      gap={2}
      align="center"
      className="px-4 py-2 bg-[#d0bcff05] rounded-full border-[1px] border-[#363638]"
     >
      <Icon source="share-variant" size={16} color="#bcbcbd" />
     </Flex>
    </Pressable>
   </Flex>
   <Flex
    direction="row"
    gap={4}
    align="center"
    className="px-4 py-2 bg-[#d0bcff05] rounded-full border-[1px] border-[#363638]"
   >
    <Icon source="eye" size={14} color="#bcbcbd" />
    <TextC className="text-[#b0bec5]" size={12}>
     {item.views_count}
    </TextC>
   </Flex>
  </Flex>
 );
};

export default FooterPost;
