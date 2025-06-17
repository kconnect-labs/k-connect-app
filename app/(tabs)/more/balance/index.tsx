import { View, Text } from "react-native";
import React from "react";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { Layout } from "@ui/Layout";
import { StatusBar } from "expo-status-bar";
import { useBalance } from "@hooks/useBalance";
import { IconButton } from "react-native-paper";

const BalancePage = () => {
 const { data } = useBalance();
 if (!data) null;
 return (
  <Layout>
   <StatusBar style="auto" />
   <Flex gap={20} direction="column" className="w-full px-2 mt-20">
    <Flex direction="column" className="w-full">
     <TextC size={28} className="text-center w-full" weight="bold">
      Коннеки-Баланс
     </TextC>
     <TextC size={14} className="text-center w-full opacity-50" weight="medium">
      Управляйте своими баллами, отслеживайте историю транзакций и используйте
      баллы для покупок
     </TextC>
    </Flex>
    <Flex
     gap={15}
     direction="column"
     className="w-full p-3 bg-[#d0bcff1a] rounded-xl border-[1px] border-[#88888850]"
    >
     <TextC className="opacity-75 text-center w-full" size={20} weight="bold">
      Текущий баланс
     </TextC>
     <TextC className="text-center w-full" size={50} weight="bold">
      {data?.points}
     </TextC>
     <Flex
      className="w-full bg-[#8274a3] rounded-xl p-2"
      justify="space-evenly"
     >
      <Flex direction="column" align="center">
       <IconButton
        icon={"credit-card-outline"}
        iconColor="#fff"
        className="bg-[#614c93]"
       />
       <TextC size={10}>Оплатить</TextC>
      </Flex>
      <Flex direction="column" align="center">
       <IconButton icon={"plus"} iconColor="#fff" className="bg-[#614c93]" />
       <TextC size={10}>Пополнить</TextC>
      </Flex>
      <Flex direction="column" align="center">
       <IconButton icon={"send"} iconColor="#fff" className="bg-[#614c93]" />
       <TextC size={10}>Перевести</TextC>
      </Flex>
     </Flex>
    </Flex>
   </Flex>
  </Layout>
 );
};

export default BalancePage;
