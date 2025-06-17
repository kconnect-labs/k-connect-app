import { Root } from "types/historyUsername";
import { useFetch } from "./useFetch";

export const useHistoryUsername = ({ username }: { username: string }) => {
 return useFetch<Root>({
  url: `https://k-connect.ru/api/username/history/${username}`,
 });
};
