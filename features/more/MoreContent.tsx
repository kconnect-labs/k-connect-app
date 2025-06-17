import { ScrollView } from "react-native";
import MoreBanner from "./MoreBanner/MoreBanner";
import MoreProfile from "./MoreOptions/MoreProfile";
import { Flex } from "@ui/Flex";

const MoreContent = () => {
 return (
  <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
   <Flex className="w-full" direction="column" gap={20}>
    <MoreBanner />
    <MoreProfile />
   </Flex>
  </ScrollView>
 );
};

export default MoreContent;
