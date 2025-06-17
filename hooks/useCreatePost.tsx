import useAuthStore from "stores/useAuthStore";
import { useState } from "react";

export const useCreatePost = () => {
 const { user } = useAuthStore();
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<Error | null>(null);

 const createPost = async (content: string, image?: File) => {
  if (!content) return null;

  setIsLoading(true);
  setError(null);

  try {
   const formData = new FormData();
   formData.append("content", content);
   if (image) {
    formData.append("image", image);
   }

   const response = await fetch(`https://k-connect.ru/api/posts/create`, {
    method: "POST",
    headers: {
     "X-API-Key": "liquide-loshara-gg-v2",
    },
    body: formData,
   });

   if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
   }

   return await response.json();
  } catch (err) {
   setError(err instanceof Error ? err : new Error("Unknown error"));
   return null;
  } finally {
   setIsLoading(false);
  }
 };

 return { createPost, isLoading, error };
};
