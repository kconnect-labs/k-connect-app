import { usePost } from "@hooks/usePost";
import { useLocalSearchParams } from "expo-router";
import PostContent from "features/post/PostContent";

const PostID = () => {
 const { id } = useLocalSearchParams();
 if (Array.isArray(id)) {
  return null;
 }
 const { data } = usePost({ id });

 if (!data) return null;

 return <PostContent data={data} />;
};

export default PostID;
