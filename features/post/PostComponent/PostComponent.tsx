import { Flex } from "@ui/Flex";
import HeaderPost from "features/profile/ProfilePosts/HeaderPost";
import TextPost from "features/profile/ProfilePosts/TextPost";
import ImagePost from "features/profile/ProfilePosts/ImagePost";
import MusicPost from "features/profile/ProfilePosts/MusicPost";
import FooterPost from "features/profile/ProfilePosts/FooterPost";
import { Post as DefaultPost } from "types/post";
import { Post as Posts } from "types/posts";
import { Post as HomePosts } from "types/postsFeed";

export type TypesPost = DefaultPost | Posts | Posts | HomePosts;

export default function PostComponent({ post }: { post: TypesPost }) {
 return (
  <Flex direction="column" className="bg-[#1e1f20] rounded-xl w-full p-4">
   <HeaderPost item={post} />
   <TextPost item={post} />
   <ImagePost item={post} />
   <MusicPost item={post} />
   <FooterPost item={post} />
  </Flex>
 );
}
