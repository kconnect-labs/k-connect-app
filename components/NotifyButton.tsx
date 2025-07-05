import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StatusBar } from "react-native";
import { Icon } from "react-native-paper";
import { useNotifyStore } from "stores/notifyStore";

const NotifyButton = () => {
 const translateY = useRef(new Animated.Value(-100)).current;
 const { height: screenHeight } = Dimensions.get("window");

 const { visible, message, icon, color, duration, hide } = useNotifyStore();

 useEffect(() => {
  if (visible) {
   Animated.spring(translateY, {
    toValue: 0,
    useNativeDriver: true,
   }).start();

   const timer = setTimeout(() => {
    Animated.timing(translateY, {
     toValue: -100,
     duration: 300,
     useNativeDriver: true,
    }).start(() => {
     hide();
    });
   }, duration);

   return () => clearTimeout(timer);
  }
 }, [visible, duration, hide]);

 if (!visible) return null;

 return (
  <Animated.View
   style={{
    transform: [{ translateY }],
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: StatusBar.currentHeight || 0,
   }}
  >
   <Flex
    direction="row"
    align="center"
    gap={8}
    className="bg-[#1e1f20] border-b-[1px] border-[#292a2b] p-4 mx-4 mt-2 rounded-3xl"
   >
    <Icon source={icon} size={24} color={color} />
    <TextC className="flex-1" color={color}>
     {message}
    </TextC>
   </Flex>
  </Animated.View>
 );
};

export default NotifyButton;
