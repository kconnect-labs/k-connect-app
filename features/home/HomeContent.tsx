import { Flex } from "@ui/Flex";
import Online from "./Online/Online";
import CreatePost from "../profile/CreatePost/CreatePost";
import HomeTab from "./HomeTab/HomeTab";
import { ScrollView } from "react-native-gesture-handler";

export default function HomeContent() {
 return (
  <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
   <Flex className="w-full" direction="column" gap={15}>
    <Online />
    <CreatePost />
    <HomeTab />
    {/* <HomePosts /> */}
   </Flex>
  </ScrollView>
 );
}
