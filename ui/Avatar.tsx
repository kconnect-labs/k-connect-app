import {
 View,
 Text,
 Image,
 ImageSourcePropType,
 Pressable,
} from "react-native";
import { Flex } from "./Flex";
import { FC } from "react";
import TextC from "./TextC";
import { router } from "expo-router";

export type Props = {
 image?: ImageSourcePropType;
 borderColor?: string;
 title?: string;
 size?: number;
 className?: string;
 textColor?: string;
 userId?: number;
};

const Avatar: FC<Props> = ({
 borderColor,
 textColor,
 image,
 title = "NN",
 size = 14,
 className,
 userId,
}) => {
 return (
  <Pressable
   onPress={() => {
    if (userId)
     router.navigate({
      pathname: "/profile/[userId]",
      params: { userId: userId },
     });
   }}
  >
   <Flex
    style={{
     width: size * 2,
     height: size * 2,
    }}
    className="rounded-full overflow-hidden border-[1px] border-[#292929] bg-[#292929] relative"
    align="center"
    justify="center"
   >
    {image ? (
     <Image source={image} style={{ width: "100%", height: "100%" }} />
    ) : (
     <TextC color={textColor} size={12} weight="bold">
      {title}
     </TextC>
    )}
   </Flex>
  </Pressable>
 );
};

export default Avatar;
