import { useBalance } from "@hooks/useBalance";
import { useProfile } from "@hooks/useProfile";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { InteractionManager, Pressable, View } from "react-native";
import { Icon } from "react-native-paper";
import useAuthStore from "stores/useAuthStore";
import { formatBalance } from "utils/formatter";
import Option from "./components/Option";

const MoreProfile = () => {
 const { data } = useProfile();
 const { data: dataBalance } = useBalance();
 const { logout, user } = useAuthStore();
 if (!dataBalance || !data) return null;
 if (!user || !data?.user) return null;
 return (
  <Flex className="w-full h-full relative p-4" direction="column" gap={6}>
   <View
    className="w-full  bg-[#131313] h-[40px] absolute left-0 -top-10"
    style={{
     borderTopLeftRadius: "50%",
     borderTopRightRadius: "50%",
     borderBottomLeftRadius: 0,
     borderBottomRightRadius: 0,
    }}
   />

   <Flex className="w-full -mt-24" justify="center">
    <Image
     className="border-[10px] border-red-500"
     style={{
      width: 120,
      height: 120,
      borderRadius: 100,
      borderColor: "#131313",
      borderWidth: 5,
     }}
     source={{
      uri: `https://k-connect.ru${data?.user.avatar_url}`,
     }}
    />
   </Flex>

   {/* <Flex
    direction="column"
    style={{
     borderRadius: 30,
    }}
    className="bg-[#2a2a2a] w-full p-4"
    gap={10}
   >
    <Option description="20 баллов" icon="wallet" label="Баланс" />
    <Option
     onPress={() => router.navigate("/more/badges")}
     description="Бэйджики"
     icon="shopping"
     label="Магазин"
    />
   </Flex>
   <Flex className="w-full bg-[#2a2a2a] p-1 rounded-3xl">
    <Button
     buttonColor="#2a2a2a"
     onPress={() => {
      logout();
      router.replace("(auth)/login");
     }}
     style={{
      borderRadius: 10,
      justifyContent: "flex-start",
     }}
     icon="logout"
     textColor="#f44336"
     className="w-full"
    >
     Выйти
    </Button>
   </Flex> */}
   <Flex direction="column" gap={10} className="w-full" align="center">
    <Flex className="w-full" justify="space-between" align="center" gap={12}>
     <Pressable
      onPress={() => router.navigate("/more/balance")}
     >
      <Flex
       gap={5}
       className="rounded-3xl border-[1px] border-[#88888850] py-2 px-3"
      >
       <Icon source={"wallet"} size={20} color="#ccc" />
       <TextC color="#ccb8fa" weight="bold">
        {formatBalance(dataBalance.points)} баллов
       </TextC>
      </Flex>
     </Pressable>
     <Flex
      gap={5}
      className="rounded-3xl border-[1px] border-[#88888850] py-2 px-3"
     >
      <Icon source={"shopping"} size={20} color="#ccc" />
      <TextC color="#fff">Магазин</TextC>
     </Flex>
     <Flex
      gap={5}
      className="rounded-3xl border-[1px] border-[#88888850] py-2 px-3"
     >
      <Icon source={"cog"} size={20} color="#ccc" />
      <TextC color="#fff">Настройки</TextC>
     </Flex>
    </Flex>

    <Flex
     className="rounded-2xl border-[1px] border-[#2d2d2d] p-4 w-full bg-[#232323]"
     direction="column"
     gap={10}
    >
     <TextC weight="bold" color="#ccc" size={12} className="w-full">
      Социальное
     </TextC>

     <Flex direction="column" className="w-full" gap={6}>
      <Option icon="magnify" label="Поиск" />
      <Option icon="account-supervisor" label="Подписки" />
      <Option icon="access-point" label="Каналы" />
      <Option icon="chart-bar" label="Рейтинг" />
     </Flex>
    </Flex>
    <Flex
     className="rounded-2xl border-[1px] border-[#2d2d2d] p-4 w-full bg-[#232323]"
     direction="column"
     gap={10}
    >
     <TextC weight="bold" color="#ccc" size={12} className="w-full">
      Развлечение
     </TextC>

     <Flex direction="column" className="w-full" gap={6}>
      <Option
       background
       icon="gamepad-variant"
       color="#d57d89"
       label="Мини-игры"
      />
      <Option background icon="gavel" label="Аукцион юзернеймов" />
      <Option icon="star" label="Планы подписок" />
     </Flex>
    </Flex>
    <Flex
     className="rounded-2xl border-[1px] border-[#2d2d2d] p-4 w-full bg-[#232323]"
     direction="column"
     gap={10}
    >
     <TextC weight="bold" color="#ccc" size={12} className="w-full">
      Платформа
     </TextC>

     <Flex direction="column" className="w-full" gap={6}>
      <Option icon="bug" label="Баг-репорты" />
      <Option icon="information" label="О платформе" />
      <Option icon="book" label="Правила" />
      <Option icon="code-tags" label="API-Документация" />
      <View className="w-full h-[1px] rounded-full bg-[#88888850]" />
      <Option
       icon="logout"
       textColor="#f44336"
       color="#f44336"
       label="Выйти"
       onPress={async () => {
        try {
          await logout();
          await SecureStore.deleteItemAsync("sessionKey");
          InteractionManager.runAfterInteractions(() => {
            try {
              router.replace("/(auth)/login");
            } catch (e) {
              console.error("Navigation after logout failed", e);
            }
          });
        } catch (err) {
          console.error("Logout failed", err);
        }
       }}
      />
     </Flex>
    </Flex>
   </Flex>
  </Flex>
 );
};

export default MoreProfile;
