// import { useEffect, useState, useCallback } from "react";
// import { Root } from "src/types/badges";

import { Root } from "types/badges";
import { useFetch } from "./useFetch";

// export const useBadges = () => {
//   const [data, setData] = useState<Root | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchPosts = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("https://k-connect.ru/api/badges/shop", {
//         method: "GET",
//         headers: {
//           "X-API-Key": "liquide-loshara-gg",
//         },
//       });
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const result = await response.json();
//       setData(result);
//       setError(null);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("An unknown error occurred")
//       );
//       setData(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const refetch = useCallback(() => {
//     return fetchPosts();
//   }, [fetchPosts]);

//   return { data, error, isLoading, refetch };
// };

export const useBadges = () => {
 return useFetch<Root>({
  url: `https://k-connect.ru/api/badges/shop`,
 });
};
