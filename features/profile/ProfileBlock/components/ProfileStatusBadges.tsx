import { View } from "react-native";
import { Pressable } from "react-native";
import { SVG_ULTIMA } from "assets/svg/svg";
import Badge from "@ui/Badge";
import { Root } from "types/profile";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import React from "react";

import { useOnline } from "@hooks/useOnline";

const ProfileStatusBadges = React.memo(({ data }: { data: Root | null }) => {
 const { data: dataOnline } = useOnline();

 return (
  <Flex align="center" gap={8}>
   <Badge
    color="#6b6b67"
    children={<TextC>@{data?.user?.username ?? "0"}</TextC>}
   />
   {dataOnline?.is_online ? (
    <Badge
     color="#1f3322"
     children={<TextC color="#22c45d">онлайн</TextC>}
     icon={<View className="w-2 h-2 bg-green-500 rounded-full" />}
     textColor="#66bb6a"
    />
   ) : (
    <Badge
     color="#888888"
     children={<TextC color="#ccc">{dataOnline?.last_active}</TextC>}
     textColor="#66bb6a"
    />
   )}

   {data?.subscription?.active && (
    <Pressable
     onLongPress={() => {
      const timer = setTimeout(() => {
       alert(
        `${data.subscription.type} Истекает: ${new Date(
         data.subscription.expires_at
        ).toLocaleString("RU-ru", {
         day: "numeric",
         month: "long",
         year: "numeric",
        })}`
       );
      }, 1000);

      return () => clearTimeout(timer);
     }}
    >
     <Badge
      color="#412f77"
      children={<TextC color="#7c4dff">Ultimate</TextC>}
      icon={<SVG_ULTIMA fill="#7c4dff" size={18} />}
      textColor="#7c4dff"
     />
    </Pressable>
   )}
  </Flex>
 );
});
export default ProfileStatusBadges;
