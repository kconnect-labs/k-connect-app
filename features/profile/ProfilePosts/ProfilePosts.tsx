import { Flex } from "@ui/Flex";
import HeaderPost from "./HeaderPost";
import TextPost from "./TextPost";
import ImagePost from "./ImagePost";
import MusicPost from "./MusicPost";
import FooterPost from "./FooterPost";
import { ActivityIndicator } from "react-native-paper";
import { Root } from "types/posts";
import { View } from "react-native";
import CreatePost from "../CreatePost/CreatePost";
import useAuthStore from "stores/useAuthStore";
import TextC from "@ui/TextC";

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
   {data?.posts?.map((item) => (
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
   ))}
  </Flex>
 );
};

export default ProfilePosts;
