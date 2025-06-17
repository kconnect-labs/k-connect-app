import React from "react";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import Avatar from "@ui/Avatar";
import { Root } from "types/profile";
import { useFollowing } from "@hooks/useFollowing";
import { useFriends } from "@hooks/useFriends";

const ProfileSubInfo = React.memo(({ data }: { data: Root | null }) => {
 const { data: dataFriends } = useFriends();
 const { data: dataFollowing } = useFollowing();
 return (
  <Flex align="center" justify="space-between" className="w-full">
   <Flex direction="column" gap={4} className="w-1/2">
    <TextC weight="bold" className="opacity-75 w-full">
     Друзья
    </TextC>
    <Flex gap={4} align="center">
     {dataFriends?.friends
      .slice(0, 3)
      .map((follower: { id: number; avatar_url: string }) => (
       <Avatar
        key={follower.id}
        size={16}
        userId={follower.id}
        image={{
         uri: `https://k-connect.ru${follower.avatar_url}`,
        }}
       />
      ))}
     {dataFriends?.friends && dataFriends?.friends?.length > 4 && (
      <Avatar
       size={14}
       title={`+${data?.friends_count && data?.friends_count - 3}`}
       className="rounded-full"
       textColor={data?.user.status_color}
      />
     )}
    </Flex>
   </Flex>
   <Flex direction="column" gap={4} className="w-1/2">
    <TextC weight="bold" className="opacity-75 w-full">
     Подпикси
    </TextC>
    <Flex gap={4} align="center">
     {dataFollowing?.following
      .slice(0, 3)
      .map((follower: { id: number; avatar_url: string }) => (
       <Avatar
        userId={follower.id}
        key={follower.id}
        size={16}
        image={{ uri: `https://k-connect.ru${follower.avatar_url}` }}
       />
      ))}
     {dataFollowing?.following && dataFollowing?.following?.length > 3 && (
      <Avatar
       size={14}
       title={`+${data?.followers_count && data?.followers_count - 3}`}
       className="rounded-full"
       textColor={data?.user.status_color}
      />
     )}
    </Flex>
   </Flex>
  </Flex>
 );
});

export default ProfileSubInfo;
