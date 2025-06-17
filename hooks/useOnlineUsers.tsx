import { Root } from "types/onlineUsers";
import { useFetch } from "./useFetch";

export const useOnlineUsers = () => {
 return useFetch<Root>({
  url: `https://k-connect.ru/api/users/online?limit=50`,
 });
};
