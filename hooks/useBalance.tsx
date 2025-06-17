import { useFetch } from "./useFetch";

export const useBalance = () => {
 return useFetch<{ points: number }>({
  url: `https://k-connect.ru/api/user/points`,
 });
};
