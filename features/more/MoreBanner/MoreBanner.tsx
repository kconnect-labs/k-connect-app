import { useProfile } from "@hooks/useProfile";
import { Flex } from "@ui/Flex";
import { View, Image } from "react-native";
import useAuthStore from "stores/useAuthStore";

const MoreBanner = () => {
 const { user } = useAuthStore();
 const { data } = useProfile();

 return (
  <Flex className="w-full" direction="column" align="center">
   <View style={{ width: "100%", position: "relative" }}>
    <Image
     source={{ uri: `https://k-connect.ru${user.banner_url}` }}
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
