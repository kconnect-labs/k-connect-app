import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import { Root } from "types/posts";
import CreatePost from "../CreatePost/CreatePost";
import FooterPost from "./FooterPost";
import HeaderPost from "./HeaderPost";
import ImagePost from "./ImagePost";
import MusicPost from "./MusicPost";
import TextPost from "./TextPost";

const ProfilePosts = ({ data, id }: { data: Root | null; id?: number }) => {
 const { user } = useAuthStore();
 if (!data)
  return (
   <View className="w-full rounded-xl bg-[#1e1f20] p-4">
    <ActivityIndicator color="#d4c1ff" />
   </View>
  );

 return (
  <Flex direction="column" gap={10} className="w-full">
   {!id && <CreatePost />}
   {data?.posts && Array.isArray(data.posts) && data.posts.length > 0 ? (
    data.posts.map((item) => (
     <Flex
      key={item.id}
      direction="column"
      className="bg-[#1e1f20] rounded-xl w-full p-4"
     >
      <HeaderPost item={item} />
      <TextPost item={item} />
      <ImagePost item={item} />
      <MusicPost item={item} />
      <FooterPost item={item} />
     </Flex>
    ))
   ) : (
    <View className="w-full rounded-xl bg-[#1e1f20] p-4">
     <TextC className="text-center text-gray-400">No posts yet</TextC>
    </View>
   )}
  </Flex>
 );
};

export default ProfilePosts;
