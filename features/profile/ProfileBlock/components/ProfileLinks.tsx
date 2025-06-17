import { Flex } from "@ui/Flex";
import { Root } from "types/profile";
import { Linking } from "react-native";
import ProfileLinkFormatter from "utils/ProfileLinkFormatter";
import { Button } from "react-native-paper";
import React from "react";

const ProfileLinks = React.memo(({ data }: { data: Root | null }) => {
 return (
  <Flex align="center" gap={6} className="flex-wrap">
   {data?.socials?.map((item, index) => (
    <Button
     compact
     onPress={() => {
      if (item.link) {
       Linking.openURL(item.link);
      }
     }}
     key={index}
     buttonColor="#292a2a"
     className=" border-[1px] border-[#292a2b] rounded-3xl p-2"
    >
     <ProfileLinkFormatter icon={item.name} color={data?.user.status_color} />
    </Button>
   ))}
  </Flex>
 );
});

export default ProfileLinks;
