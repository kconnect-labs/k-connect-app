// import { useEffect, useState, useCallback } from "react";
// import useAuthStore from "stores/useAuthStore";
// import { Root } from "types/profile";

import useAuthStore from "stores/useAuthStore";
import { Root } from "types/profile";
import { useFetch } from "./useFetch";

// export const useProfile = () => {
//  const [data, setData] = useState<Root | null>(null);
//  const [error, setError] = useState<Error | null>(null);
//  const [isLoading, setIsLoading] = useState(true);
//  const { user } = useAuthStore();
//  const fetchProfile = useCallback(async () => {
//   try {
//    setIsLoading(true);
//    const response = await fetch(
//     `https://k-connect.ru/api/profile/${user.username}`,

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
//   fetchProfile();
//  }, [fetchProfile]);

//  const refetch = useCallback(() => {
//   return fetchProfile();
//  }, [fetchProfile]);

//  return { data, error, isLoading, refetch };
// };

export const useProfile = (params?: { id?: number }) => {
 const { user } = useAuthStore();
 const userId = params?.id ?? user.id;
 return useFetch<Root>({
  url: `https://k-connect.ru/api/profile/${userId}`,
 });
};
