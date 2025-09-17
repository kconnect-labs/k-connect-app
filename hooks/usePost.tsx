import { useCallback, useEffect, useState } from "react";
import { Root } from "types/post";

export const usePost = ({ id }: { id: string | number }) => {
 const [data, setData] = useState<Root | null>(null);
 const [error, setError] = useState<Error | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 const fetchPost = useCallback(async () => {
  if (!id) {
   setIsLoading(false);
   return;
  }

  try {
   setIsLoading(true);
   const response = await fetch(`https://k-connect.ru/api/posts/${id}`, {
    method: "GET",
    headers: {
     "X-API-Key": "liquide-gg-v2",
     "Content-Type": "application/json",
    },
   });
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
 }, [id]);

 useEffect(() => {
  fetchPost();
 }, [fetchPost]);

 const refetch = useCallback(() => {
  return fetchPost();
 }, [fetchPost]);

 return { data, error, isLoading, refetch };
};
