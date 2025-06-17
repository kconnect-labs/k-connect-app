import { useState } from "react";
import useAuthStore from "stores/useAuthStore";
import { Root as RootLikePost } from "types/likePost";

export const useLike = () => {
 const { user } = useAuthStore();
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<Error | null>(null);

 const likePost = async ({ postId }: { postId: number }) => {
  setIsLoading(true);
  setError(null);

  try {
   const response = await fetch(
    `https://k-connect.ru/api/posts/${postId}/like`,
    {
     method: "POST",
     headers: {
      "X-API-Key": "liquide-loshara-gg-v2",
     },
    }
   );

   if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
   }

   const data: RootLikePost = await response.json();

   return { ...data };
  } catch (err) {
   setError(err instanceof Error ? err : new Error("Unknown error"));
   return null;
  } finally {
   setIsLoading(false);
  }
 };

 return { likePost, isLoading, error };
};
