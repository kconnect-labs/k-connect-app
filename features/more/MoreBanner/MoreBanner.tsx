import { useProfile } from "@hooks/useProfile";
import { Flex } from "@ui/Flex";
import { Image, View } from "react-native";
import useAuthStore from "stores/useAuthStore";
import { buildImageUrl } from "utils/urlUtils";

const MoreBanner = () => {
 const { user } = useAuthStore();
 const { data } = useProfile();

 return (
  <Flex className="w-full" direction="column" align="center">
   <View style={{ width: "100%", position: "relative" }}>
    <Image
     source={{ uri: buildImageUrl(user.banner_url) }}
     style={{
      width: "100%",
      height: 140,
     }}
    />
   </View>
  </Flex>
 );
};

export default MoreBanner;
