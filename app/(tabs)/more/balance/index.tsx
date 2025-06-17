import { useBalance } from "@hooks/useBalance";
import { Flex } from "@ui/Flex";
import { Layout } from "@ui/Layout";
import TextC from "@ui/TextC";
import { BalanceTabContent, BalanceTabs } from "components/BalanceTabs";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, IconButton } from "react-native-paper";

const BalancePage = () => {
 const { data } = useBalance();
 const [activeTab, setActiveTab] = useState<"history" | "assets" | "subscription">("history");
 const [isExpanded, setIsExpanded] = useState(false);
 const animationHeight = useRef(new Animated.Value(0)).current;
 const rotateAnimation = useRef(new Animated.Value(0)).current;

 React.useEffect(() => {
  if (isExpanded) {
   Animated.timing(animationHeight, {
    toValue: 1,
    duration: 300,
    useNativeDriver: false,
   }).start();
   Animated.timing(rotateAnimation, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
   }).start();
  } else {
   Animated.timing(animationHeight, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
   }).start();
   Animated.timing(rotateAnimation, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
   }).start();
  }
 }, [isExpanded]);

 const toggleExpand = () => {
  setIsExpanded(!isExpanded);
 };

 const heightInterpolate = animationHeight.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 200], // Adjust max height as needed
 });

 const rotateInterpolate = rotateAnimation.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
 });

 if (!data) return null;

 return (
  <Layout>
   <StatusBar style="auto" />
   <Flex
    direction="column"
    className="w-full flex-1 items-center justify-start"
    style={{ paddingHorizontal: 5 }}
   >
    <View
     className="w-full rounded-2xl p-6"
     style={{
      backgroundColor: "#232323",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
     }}
    >
     <Flex className="w-full justify-center mb-8">
      <View
       style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#614c93",
        justifyContent: "center",
        alignItems: "center",
       }}
      >
       <Icon source={"rss"} size={40} color="#ccc" />
      </View>
     </Flex>

     <TextC className="text-center w-full opacity-75" size={16} weight="medium">
      Текущий баланс
     </TextC>
     <TextC className="text-center w-full" size={50} weight="bold">
      {data?.points}
     </TextC>

     <Flex className="w-full justify-around mt-8">
      {/* Оплатить button */}
      <Flex direction="column" align="center" gap={5} flex={1}>
       <IconButton
        icon={"credit-card-outline"}
        iconColor="#fff"
        size={30}
        containerColor="#614c93"
        style={{ borderRadius: 30 }}
       />
       <TextC size={12}>Оплатить</TextC>
      </Flex>
      {/* Пополнить button */}
      <Flex direction="column" align="center" gap={5} flex={1}>
       <IconButton
        icon={"plus"}
        iconColor="#fff"
        size={30}
        containerColor="#614c93"
        style={{ borderRadius: 30 }}
       />
       <TextC size={12}>Пополнить</TextC>
      </Flex>
      {/* Перевести button */}
      <Flex direction="column" align="center" gap={5} flex={1}>
       <IconButton
        icon={"send"}
        iconColor="#fff"
        size={30}
        containerColor="#614c93"
        style={{ borderRadius: 30 }}
       />
       <TextC size={12}>Перевести</TextC>
      </Flex>
     </Flex>
    </View>

    {/* How points are awarded section */}
    <View
     className="w-full rounded-2xl p-6 mt-4"
     style={{
      backgroundColor: "#232323",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
     }}
    >
     <Pressable onPress={toggleExpand}>
      <Flex justify="space-between" align="center">
       <Flex gap={5} align="center">
        <Icon source="information" size={20} color="#ccc" />
        <TextC size={16} weight="medium">
         Как начисляются баллы?
        </TextC>
       </Flex>
       <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <Icon source="chevron-down" size={20} color="#ccc" />
       </Animated.View>
      </Flex>
     </Pressable>
     <Animated.View style={{ height: heightInterpolate, overflow: 'hidden' }}>
      <TextC size={14} className="mb-2">
       Баллы начисляются за активность на платформе:
      </TextC>
      <View>
       <TextC size={14} className="mb-1">
        • Создание постов и историй
       </TextC>
       <TextC size={14} className="mb-1">
        • Получение лайков и комментариев
       </TextC>
       <TextC size={14} className="mb-1">
        • Ответы на комментарии
       </TextC>
       <TextC size={14} className="mb-1">
        • Репосты и просмотры
       </TextC>
       <TextC size={14} className="mb-1">
        • Реакции на истории
       </TextC>
      </View>
      <TextC size={12} className="mt-4 opacity-75">
       Подробную информацию о системе начисления баллов можно найти в разделе
       рейтинга.
      </TextC>
     </Animated.View>
    </View>

    {/* Balance Tabs */}
    <View className="w-full mt-4">
     <BalanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
     <BalanceTabContent activeTab={activeTab} />
    </View>

   </Flex>
  </Layout>
 );
};

export default BalancePage;
