import { SVG_CHECK_CIRCLE } from "@assets/svg/svg";
import Avatar from "@ui/Avatar";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { Image } from "expo-image";
import { TypesPost } from "features/post/PostComponent/PostComponent";
import { Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import { formatStatus, postTimeFormatter } from "utils/formatter";
import { buildImageUrl } from "utils/urlUtils";

const HeaderPost = ({ item }: { item: TypesPost }) => {
 const { user } = useAuthStore();
 return (
  <Flex justify="space-between" className="w-full" align="center">
   <Flex gap={6}>
    <Avatar
     userId={item.user.id}
     size={20}
     image={{
      uri: buildImageUrl(`/static/uploads/${item.user.avatar_url}`),
     }}
    />
    <Flex direction="column">
     <Flex direction="row" gap={4} align="center">
      <TextC weight="bold">{item.user.name}</TextC>
      <SVG_CHECK_CIRCLE
       size={18}
       fill={formatStatus(user.verification_status)}
      />
      <Image
       style={{
        width: 20,
        height: 20,
       }}
       source={{
        uri: buildImageUrl("/static/images/bages/shop/2972aca5-5dc9-403c-a660-621f1a0bf379.svg"),
       }}
      />
     </Flex>
     <TextC size={12} className="opacity-50">
      {postTimeFormatter(item.timestamp ?? 0)}
     </TextC>
    </Flex>
   </Flex>
   <Flex>
    <Icon source="dots-vertical" size={20} color="#888888" />
   </Flex>
  </Flex>
 );
};

export default HeaderPost;
