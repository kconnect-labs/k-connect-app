import { Root } from "types/profile";
import { Flex } from "@ui/Flex";
import { Button } from "react-native-paper";

const ProfileFollow = ({ data }: { data: Root | null }) => {
 return (
  <Flex className="mt-2">
   <Button
    icon={data?.is_following ? "account-minus" : "account-plus"}
    textColor={data?.is_following ? "#b0bec5" : "#000"}
    buttonColor={
     data?.is_following
      ? `${data.user.status_color}30`
      : data?.user.status_color
    }
    className="w-full"
    onPress={() => {
     // API FOLLOW LOGIC
    }}
   >
    {data?.is_following ? "Отписаться" : "Подписаться"}
   </Button>
  </Flex>
 );
};

export default ProfileFollow;
