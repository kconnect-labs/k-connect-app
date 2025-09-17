import { PropsTypePost } from "features/home/HomePosts/HomePosts";
import { Root } from "types/postsFeed";
import { useFetch } from "./useFetch";

export const usePostsFeed = ({ type }: PropsTypePost) => {
 return useFetch<Root>({
  url: `https://k-connect.ru/api/posts/feed?sort=${type}`,
 });
};
