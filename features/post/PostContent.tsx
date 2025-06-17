import { Flex } from "@ui/Flex";
import { SafeAreaView } from "react-native-safe-area-context";
import { Root } from "types/post";
import HeaderScreen from "./HeaderScreen/HeaderScreen";
import PostComponent from "./PostComponent/PostComponent";
import Comments from "./Comments/Comments";
import { ScrollView } from "react-native-gesture-handler";

export default function PostContent({ data }: { data: Root }) {
 return (
  <SafeAreaView className="w-full">
   <Flex direction="column" className="w-full" gap={10}>
    <HeaderScreen />
    <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
     <Flex direction="column" gap={20}>
      <PostComponent post={data.post} />
      <Comments
       comments={data.comments}
       commentsCount={data.post.comments_count}
      />
     </Flex>
    </ScrollView>
   </Flex>
  </SafeAreaView>
 );
}
