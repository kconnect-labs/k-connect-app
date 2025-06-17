import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { TextInput } from "react-native";
import { Icon } from "react-native-paper";
import Avatar from "@ui/Avatar";
import { postTimeFormatter } from "utils/formatter";
import { Comment } from "types/post";
import Replies from "./Replies/Replies";

export default function Comments({
 comments,
 commentsCount,
}: {
 comments: Comment[];
 commentsCount: number;
}) {
 return (
  <Flex>
   <Flex direction="column" className="w-full">
    <Flex direction="column" className="w-full">
     <Flex
      align="center"
      gap={10}
      className="px-4 py-2 border-2 rounded-xl border-[#1e1f20] mx-5"
     >
      <Icon source="image-outline" size={24} color="#888888" />
      <TextInput
       placeholder="Написать комментарий..."
       placeholderTextColor="#888888"
       className="flex-1 text-[white]"
      />
      <Icon source="arrow-right" size={24} color="#888888" />
     </Flex>
    </Flex>
    <Flex align="center" gap={6} className="p-4">
     <Icon source={"comment-outline"} color="#fff" size={20} />
     <TextC weight="bold" size={16}>
      Комментарии ({commentsCount})
     </TextC>
    </Flex>
    {comments.map((comment) => (
     <Flex direction="column" gap={10} className="px-4 w-full">
      <Flex key={comment.id} direction="column" className="w-full">
       <Flex
        className="bg-[#1e1f20] p-3 rounded-xl w-full"
        direction="column"
        gap={6}
       >
        <Flex gap={10}>
         <Avatar
          userId={comment.id}
          image={{
           uri: `https://k-connect.ru/static/uploads/${comment.user.avatar_url}`,
          }}
         />
         <Flex direction="column" gap={2}>
          <TextC weight="bold" color="#fff">
           {comment.user.name}
          </TextC>
          <TextC color="#888888" size={12}>
           {postTimeFormatter(comment.timestamp)}
          </TextC>
         </Flex>
        </Flex>
        <TextC color="#fff">{comment.content}</TextC>
        <Flex direction="row" gap={10} align="center">
         <Icon source="heart-outline" size={20} color="#888888" />
         <TextC color="#888888">0</TextC>
         <Icon source="comment-outline" size={20} color="#888888" />
         <TextC color="#888888">Ответить</TextC>
        </Flex>
       </Flex>
       <Replies replies={comment.replies} />
      </Flex>
     </Flex>
    ))}
   </Flex>
  </Flex>
 );
}
