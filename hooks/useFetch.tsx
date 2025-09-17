import { useCallback, useEffect, useState } from "react";

type FetchOptions<TRequestBody = unknown> = {
 url: string;
 method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
 headers?: Record<string, string>;
 body?: TRequestBody;
 dependsOn?: any[];
};

export const useFetch = <TResponse, TRequestBody = unknown>({
 url,
 method = "GET",
 headers = {},
 body,
 dependsOn = [],
}: FetchOptions<TRequestBody>) => {
 const [data, setData] = useState<TResponse | null>(null);
 const [error, setError] = useState<Error | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 const fetchData = useCallback(async () => {
  try {
   setIsLoading(true);

   const requestOptions: RequestInit = {
    method,
    headers: {
     "X-API-Key": "liquide-v2",
     "Content-Type": "application/json",
     ...headers,
    },
   };

   if (method !== "GET" && body) {
    requestOptions.body = JSON.stringify(body);
   }

   const response = await fetch(url, requestOptions);

   if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
   }

   const result = await response.json();
   setData(result);
   setError(null);
  } catch (err) {
   setError(err instanceof Error ? err : new Error("Unknown error"));
   setData(null);
  } finally {
   setIsLoading(false);
  }
 }, [url, method, body, ...dependsOn]);

 useEffect(() => {
  fetchData();
 }, [fetchData]);

 const refetch = useCallback(() => fetchData(), [fetchData]);

 return { data, error, isLoading, refetch };
};
