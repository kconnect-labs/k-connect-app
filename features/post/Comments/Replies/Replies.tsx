import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { Icon } from "react-native-paper";
import Avatar from "@ui/Avatar";
import { postTimeFormatter } from "utils/formatter";
import { Reply } from "types/post";

export default function Replies({ replies }: { replies: Reply[] }) {
 return (
  <Flex direction="column" className="w-full">
   {replies?.reverse().map((reply: any) => (
    <Flex
     key={reply.id}
     direction="column"
     gap={4}
     className="pl-6 mt-2 w-full rounded-xl"
    >
     <Flex
      className="p-3 border-l-4 rounded-xl border-[#583b93] bg-[#1e1f20] w-full"
      direction="row"
      gap={6}
     >
      <Flex align="center" gap={5}>
       <Avatar
        userId={reply.id}
        image={{
         uri: `https://k-connect.ru/static/uploads/${reply.user.avatar_url}`,
        }}
       />
      </Flex>
      <Flex direction="column" gap={6}>
       <Flex gap={4}>
        <TextC size={12} weight="bold" color="#fff">
         {reply.user.name}
        </TextC>
        <TextC color="#888888" size={10}>
         {postTimeFormatter(reply.timestamp)}
        </TextC>
       </Flex>
       <TextC color="#fff">{reply.content}</TextC>
       <Flex direction="row" gap={10} align="center">
        <Icon
         source={reply.user_liked ? "heart" : "heart-outline"}
         size={15}
         color="#888888"
        />
        <TextC size={12} color="#888888">
         {reply.likes_count}
        </TextC>
        <Icon source="comment-outline" size={15} color="#888888" />
        <TextC size={12} color="#888888">
         Ответить
        </TextC>
       </Flex>
      </Flex>
     </Flex>
    </Flex>
   ))}
  </Flex>
 );
}
