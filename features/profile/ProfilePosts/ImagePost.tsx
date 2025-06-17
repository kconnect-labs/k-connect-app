import { Image } from "react-native";
import { Flex } from "@ui/Flex";
import { TypesPost } from "features/post/PostComponent/PostComponent";

const ImagePost = ({ item }: { item: TypesPost }) => {
 return (
  item?.images &&
  item?.images.length > 0 &&
  item.images.map((image, index) => (
   <Flex className="flew-wrap relative" key={index++}>
    <Image
     source={{ uri: `https://k-connect.ru${image}` }}
     style={{ height: 200, width: "100%" }}
     className="w-full mt-4 rounded-lg absolute opacity-75"
     blurRadius={10}
    />
    <Image
     source={{ uri: `https://k-connect.ru${image}` }}
     style={{ height: 200, width: "100%", resizeMode: "contain" }}
     className="w-full mt-4 rounded-lg"
    />
   </Flex>
  ))
 );
};

export default ImagePost;
