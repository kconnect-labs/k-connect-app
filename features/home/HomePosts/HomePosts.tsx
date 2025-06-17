import { usePostsFeed } from "@hooks/usePostsFeed";
import { Flex } from "@ui/Flex";
import { FC } from "react";
import PostComponent from "features/post/PostComponent/PostComponent";

export type PropsTypePost = {
 type: "all" | "following" | "recommended";
};

export const HomePosts: FC<PropsTypePost> = ({ type }) => {
 const { data } = usePostsFeed({ type });
 return (
  <Flex direction="column" gap={8}>
   {data?.posts.map((post: any) => (
    <PostComponent post={post} key={post.id} />
   ))}
  </Flex>
 );
};
