import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { FC } from "react";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";

type Props = {
 label: string;
 onPress?: () => void;
 icon: string;
 className?: string;
 color?: string;
 textColor?: string;
 background?: boolean;
};
const Option: FC<Props> = ({
 background,
 label,
 onPress,
 icon,
 className,
 color,
 textColor,
}) => {
 return (
  <Pressable onPress={onPress} className={className} style={{ width: "100%" }}>
   <Flex
    align="center"
    className="px-2 py-2 rounded-2xl"
    style={background && { backgroundColor: color ? `${color}10` : "#3b3940" }}
    gap={6}
   >
    <Icon source={icon} size={24} color={color ? color : "#fff"} />
    <Flex direction="column">
     <TextC color={textColor} weight="bold" size={16}>
      {label}
     </TextC>
    </Flex>
   </Flex>
  </Pressable>
 );
};

export default Option;
