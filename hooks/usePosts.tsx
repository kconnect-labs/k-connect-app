// import { useEffect, useState, useCallback } from "react";
// import useAuthStore from "stores/useAuthStore";
// import { Root } from "types/posts";

import useAuthStore from "stores/useAuthStore";
import { useFetch } from "./useFetch";
import { Root } from "types/posts";

// export const usePosts = () => {
//  const [data, setData] = useState<Root | null>(null);
//  const [error, setError] = useState<Error | null>(null);
//  const [isLoading, setIsLoading] = useState(true);

//  const { user } = useAuthStore();

//  const fetchPosts = useCallback(async () => {
//   try {
//    setIsLoading(true);
//    const response = await fetch(
//     `https://k-connect.ru/api/profile/${user.username}/posts`,

//     {
//      method: "GET",
//      headers: {
//       "X-API-Key": "liquide-loshara-gg",
//       "Content-Type": "application/json",
//      },
//     }
//    );
//    if (!response.ok) {
//     throw new Error("Network response was not ok");
//    }
//    const result = await response.json();
//    setData(result);
//    setError(null);
//   } catch (err) {
//    setError(
//     err instanceof Error ? err : new Error("An unknown error occurred")
//    );
//    setData(null);
//   } finally {
//    setIsLoading(false);
//   }
//  }, []);

//  useEffect(() => {
//   fetchPosts();
//  }, [fetchPosts]);

//  const refetch = useCallback(() => {
//   return fetchPosts();
//  }, [fetchPosts]);

//  return { data, error, isLoading, refetch };
// };

export const usePosts = ({ id: paramID }: { id?: number }) => {
 const { user } = useAuthStore();
 const userId = paramID ?? user.id;
 return useFetch<Root>({
  url: `https://k-connect.ru/api/profile/${userId}/posts`,
 });
};
