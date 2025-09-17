import { useCallback, useEffect, useState } from "react";
import useAuthStore from "stores/useAuthStore";
import { Root } from "types/profile";

export const useProfile = (params?: { id?: number }) => {
 const [data, setData] = useState<Root | null>(null);
 const [error, setError] = useState<Error | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 const { user } = useAuthStore();
 const userId = params?.id ?? user?.id;

 const fetchProfile = useCallback(async () => {
  if (!userId) {
   setIsLoading(false);
   return;
  }

  try {
   setIsLoading(true);
   const response = await fetch(
    `https://k-connect.ru/api/profile/${userId}`,
    {
     method: "GET",
     headers: {
      "X-API-Key": "liquide-gg-v2",
      "Content-Type": "application/json",
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
 }, [userId]);

 useEffect(() => {
  fetchProfile();
 }, [fetchProfile]);

 const refetch = useCallback(() => {
  return fetchProfile();
 }, [fetchProfile]);

 return { data, error, isLoading, refetch };
};
