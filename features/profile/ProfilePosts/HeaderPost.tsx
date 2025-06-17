import { Post, Root } from "types/posts";
import { Flex } from "@ui/Flex";
import Avatar from "@ui/Avatar";
import TextC from "@ui/TextC";
import { formatStatus, postTimeFormatter } from "utils/formatter";
import { Button, Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import { SVG_CHECK_CIRCLE } from "@assets/svg/svg";
import { Image } from "expo-image";
import { TypesPost } from "features/post/PostComponent/PostComponent";

const HeaderPost = ({ item }: { item: TypesPost }) => {
 const { user } = useAuthStore();
 return (
  <Flex justify="space-between" className="w-full" align="center">
   <Flex gap={6}>
    <Avatar
     userId={item.user.id}
     size={20}
     image={{
      uri: `https://k-connect.ru/static/uploads/${item.user.avatar_url}`,
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
       source={
        "https://k-connect.ru/static/images/bages/shop/2972aca5-5dc9-403c-a660-621f1a0bf379.svg"
       }
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
