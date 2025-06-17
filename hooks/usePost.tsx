// import { useEffect, useState, useCallback } from "react";
// import { Root } from "src/types/post";
// import { Post } from "src/types/posts";

// export const usePost = ({ id }: { id: string }) => {
//   const [data, setData] = useState<Root | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchPost = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`https://k-connect.ru/api/posts/${id}`, {
//         method: "GET",
//         headers: {
//           "X-API-Key": "liquide-loshara-gg",
//           "Content-Type": "application/json",
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
//   }, [id]);

//   useEffect(() => {
//     fetchPost();
//   }, [fetchPost]);

//   const refetch = useCallback(() => {
//     return fetchPost();
//   }, [fetchPost]);

//   return { data, error, isLoading, refetch };
// };

import { useFetch } from "./useFetch";
import { Root } from "src/types/post";

export const usePost = ({ id }: { id: any }) => {
 return useFetch<Root>({
  url: `https://k-connect.ru/api/posts/${id}`,
  dependsOn: id,
 });
};
