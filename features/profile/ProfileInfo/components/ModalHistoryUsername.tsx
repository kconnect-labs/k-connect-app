import { useHistoryUsername } from "@hooks/useHostoryUsername";
import Avatar from "@ui/Avatar";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { View } from "react-native";
import { Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import { PurchasedUsername } from "types/profile";

const ModalHistoryUsername = ({ data }: { data: PurchasedUsername }) => {
 const { data: dataHistoryUsername } = useHistoryUsername({
  username: data.username,
 });
 const { user } = useAuthStore();

 if (!data && !dataHistoryUsername) return null;
 return (
  <Flex direction="column" gap={15} className="w-full">
   <Flex align="center" gap={8}>
    <Icon source={"at"} size={24} color="#d0bcff" />
    <TextC size={18} weight="bold">
     @{data.username}
    </TextC>
   </Flex>

   <View className="w-full bg-gray-500 h-[1px]" />
   <Flex direction="column" gap={8}>
    <Flex gap={5} align="center">
     <Icon source="history" size={20} color="#d0bcff" />
     <TextC weight="bold">История владения</TextC>
    </Flex>
    <Flex className="w-full" direction="column" gap={10}>
     {dataHistoryUsername?.data.ownership_history &&
      dataHistoryUsername.data.ownership_history.length > 0 &&
      dataHistoryUsername.data.ownership_history.map(
       (user: any, index: number) => {
        const { id, is_verified, name, photo, username } =
         dataHistoryUsername.data.users[user.buyer_id];
        return (
         <Flex
          key={index}
          align="center"
          gap={10}
          justify="space-between"
          className="bg-[#151515] w-full rounded-xl py-2 px-4"
         >
          <Flex className="w-1/2" align="center" gap={10}>
           <Icon source="swap-horizontal" size={24} color="#d0bcff" />
           <Flex direction="column" gap={2}>
            <Flex align="center" gap={8}>
             <Avatar
              userId={id}
              image={{
               uri: `https://k-connect.ru${photo}`,
              }}
              size={12}
             />
             <TextC weight="medium">{name}</TextC>
             {is_verified && (
              <Icon source="check-decagram" size={16} color="#d0bcff" />
             )}
            </Flex>
            <Flex align="center" gap={4}>
             <TextC color="#999" size={12}>
              {new Date(user.timestamp).toLocaleString("ru-RU", {
               day: "numeric",
               month: "long",
               year: "numeric",
               hour: "numeric",
               minute: "numeric",
              })}
             </TextC>
            </Flex>
           </Flex>
          </Flex>
          <Flex>
           <TextC color="#ccb8fa" weight="bold">
            {user.price} баллов
           </TextC>
          </Flex>
         </Flex>
        );
       }
      )}
    </Flex>
   </Flex>
  </Flex>
 );
};

export default ModalHistoryUsername;
