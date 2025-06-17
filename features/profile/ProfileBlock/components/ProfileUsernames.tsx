import Badge from "@ui/Badge";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import React from "react";
import { Root } from "types/profile";

const ProfileUsernames = React.memo(({ data }: { data: Root | null }) => {
 return (
  <Flex align="center" gap={8}>
   {data?.user?.purchased_usernames &&
    data.user.purchased_usernames.length > 0 && (
     <Badge color="#444a4c">
      <TextC size={12}>А так же: </TextC>
      <TextC size={14} color={data.user.status_color}>
       {`${data.user.purchased_usernames
        .slice(0, 3)
        .map((u) => "@" + u.username)
        .join(", ")}`}
      </TextC>
      {data.user.purchased_usernames.length > 3 && (
       <TextC size={12} className="opacity-50">
        и ещё {data.user.purchased_usernames.length - 4}{" "}
       </TextC>
      )}
     </Badge>
    )}
  </Flex>
 );
});
export default ProfileUsernames;
