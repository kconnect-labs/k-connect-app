import { Flex } from "@ui/Flex";
import { Root } from "types/profile";
import TextC from "@ui/TextC";
import React from "react";

const ProfileDescription = React.memo(({ data }: { data: Root }) => {
 return (
  <Flex
   direction="column"
   gap={4}
   className="bg-[#242424] border-[1px] border-[#292a2b] rounded-3xl py-2 px-4 w-full"
  >
   <TextC weight="semibold" size={14}>
    {data.user.about}
   </TextC>
  </Flex>
 );
});

export default ProfileDescription;
