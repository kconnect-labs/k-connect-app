import { useCallback, useEffect, useState } from "react";
import useAuthStore from "stores/useAuthStore";
import { Root } from "types/following";

export const useFollowing = () => {
 const [data, setData] = useState<Root | null>(null);
 const [error, setError] = useState<Error | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 const { user } = useAuthStore();

 const fetchPosts = useCallback(async () => {
  if (!user?.username) {
   setIsLoading(false);
   return;
  }

  try {
   setIsLoading(true);
   const response = await fetch(
    `https://k-connect.ru/api/profile/${user.username}/following`,
    {
     method: "GET",
     headers: {
      "X-API-Key": "liquide-gg-v2",
     },
    }
   );
   if (!response.ok) {
    throw new Error("Network response was not ok");
   }
   const result = await response.json();
   setData(result);
   setError(null);
  } catch (err) {
   setError(
    err instanceof Error ? err : new Error("An unknown error occurred")
   );
   setData(null);
  } finally {
   setIsLoading(false);
  }
 }, [user?.username]);

 useEffect(() => {
  fetchPosts();
 }, [fetchPosts]);

 const refetch = useCallback(() => {
  return fetchPosts();
 }, [fetchPosts]);

 return { data, error, isLoading, refetch };
};
