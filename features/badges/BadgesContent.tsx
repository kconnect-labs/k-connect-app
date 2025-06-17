import { SVG_DOLLAR } from "assets/svg/svg";
import { useBadges } from "@hooks/useBadges";
import Badge from "@ui/Badge";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import SafeSvgUri from "utils/SafeSvgUri";
import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { ActivityIndicator, Button, Icon } from "react-native-paper";

const BadgesContent = () => {
 const { data } = useBadges();
 const [isOpen, setIsOpen] = useState(false);

 if (!data) return <ActivityIndicator />;
 return (
  <Flex className="w-wull" direction="column" gap={20}>
   <TextC size={28} weight="bold" className="text-center w-full">
    Магазин бейджиков
   </TextC>
   <Flex className="w-full" justify="space-between">
    <Flex
     gap={8}
     style={{ width: "48%" }}
     className=" bg-[#d0bcff] px-4 py-2 rounded-xl"
    >
     <Icon source="wallet" size={20} color="#000" />
     <TextC color="#000">23102332 баллов</TextC>
    </Flex>
    <Flex
     gap={8}
     style={{ width: "48%" }}
     className="bg-[#d0bcff] px-4 py-2 rounded-xl"
    >
     <Icon source="plus" size={20} color="#000" />
     <TextC color="#000">Создать бэйджик</TextC>
    </Flex>
   </Flex>
   <Button buttonColor="#191919" style={{ padding: 4, width: "100%" }}>
    <TextC size={16}>Доступные бейджики</TextC>
   </Button>

   <Flex className="w-full flex-wrap" gap={10} justify="space-between">
    <FlatList
     contentContainerStyle={{ paddingBottom: 400 }}
     data={data.badges.filter((x: { image_path: string }) =>
      x.image_path.endsWith(".gif")
     )}
     numColumns={2}
     columnWrapperStyle={{ justifyContent: "space-between" }}
     renderItem={({ item }) => (
      <Flex
       key={item.id}
       style={{ width: "48%", marginBottom: 10 }}
       direction="column"
       className="bg-[#151515] rounded-xl overflow-hidden"
      >
       <Flex align="center" justify="center" className="bg-[#111111] w-full">
        <Flex justify="center" align="center" className="w-full h-[170px]">
         {typeof item.image_path === "string" &&
         item.image_path.endsWith(".svg") ? (
          <SafeSvgUri
           uri={`https://k-connect.ru/static/images/bages/shop/${item.image_path}`}
           width={120}
           height={120}
          />
         ) : (
          <Image
           source={`https://k-connect.ru/static/images/bages/shop/${item.image_path}`}
           style={{ width: 120, height: 120 }}
          />
         )}
        </Flex>
       </Flex>
       <Flex align="center" justify="center" className="absolute top-2 right-2">
        {item?.max_copies ? (
         <Badge color="#433f4f">
          <TextC color="#d0bcff">
           {item.copies_sold}/{item.max_copies}
          </TextC>
         </Badge>
        ) : null}
       </Flex>

       <Flex
        className="bg-[#1a1a1a] w-full p-4"
        direction="column"
        gap={8}
        align="center"
       >
        <TextC size={18} weight="bold" color="#ffffff">
         {item.name}
        </TextC>
        <Flex align="center" gap={8}>
         <Icon source="account" size={16} color="#ffffff" />
         <TextC color="#ffffff">{item.creator.name}</TextC>
        </Flex>
        <Flex align="center" gap={8}>
         <SVG_DOLLAR size={16} fill="#d0bcff" />
         <TextC color="#ffffff">{item.price} баллов</TextC>
        </Flex>
        <Pressable onPress={() => setIsOpen(true)} className="w-full">
         <Flex
          className="bg-[#d0bcff] w-full rounded-xl py-2 px-4"
          align="center"
          justify="center"
         >
          <TextC className="text-center w-full" weight="bold" color="#000">
           Купить
          </TextC>
         </Flex>
        </Pressable>
       </Flex>
      </Flex>
     )}
     keyExtractor={(item) => item.id.toString()}
    />
   </Flex>
  </Flex>
 );
};

export default BadgesContent;
