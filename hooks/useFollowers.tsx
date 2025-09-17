import { useCallback, useEffect, useState } from "react";
import useAuthStore from "stores/useAuthStore";
import { Root } from "types/followers";

export const useFollowers = () => {
 const [data, setData] = useState<Root | null>(null);
 const [error, setError] = useState<Error | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 const { user } = useAuthStore();

 const fetchPosts = useCallback(async () => {
  try {
   setIsLoading(true);
   const response = await fetch(
    `https://k-connect.ru/api/profile/${user.username}/followers`,
    {
     method: "GET",
     headers: {
      "X-API-Key": "liquide-v2",
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
 }, []);

 useEffect(() => {
  fetchPosts();
 }, [fetchPosts]);

 const refetch = useCallback(() => {
  return fetchPosts();
 }, [fetchPosts]);

 return { data, error, isLoading, refetch };
};
