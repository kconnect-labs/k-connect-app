import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import React, { useState, useCallback } from "react";
import {
 View,
 TouchableOpacity,
 Text,
 StyleSheet,
 Animated,
} from "react-native";
import { HomePosts } from "../HomePosts/HomePosts";

const tabs = ["all", "subscriptions", "recommendations"] as const;
type TabKey = (typeof tabs)[number];

const HomeTab = () => {
 const [activeTab, setActiveTab] = useState<TabKey>("all");
 const [tabAnimation] = useState(new Animated.Value(tabs.indexOf(activeTab)));

 const animateTabChange = useCallback(
  (tab: TabKey) => {
   Animated.timing(tabAnimation, {
    toValue: tabs.indexOf(tab),
    duration: 300,
    useNativeDriver: true,
   }).start();

   setActiveTab(tab);
  },
  [tabAnimation, setActiveTab]
 );

 const renderContent = () => {
  switch (activeTab) {
   case "all":
    return <HomePosts type="all" />;
   case "subscriptions":
    return <HomePosts type="following" />;
   case "recommendations":
    return <HomePosts type="recommended" />;
   default:
    return null;
  }
 };

 return (
  <Flex direction="column">
   <Flex style={styles.tabContainer}>
    {tabs.map((tab) => (
     <TouchableOpacity
      key={tab}
      onPress={() => animateTabChange(tab)}
      style={[styles.tab, activeTab === tab && styles.activeTab]}
     >
      <TextC style={activeTab === tab ? styles.activeText : styles.text}>
       {tab === "all"
        ? "Все"
        : tab === "subscriptions"
        ? "Подписки"
        : "Рекомендации"}
      </TextC>
     </TouchableOpacity>
    ))}
   </Flex>
   {renderContent()}
  </Flex>
 );
};

const styles = StyleSheet.create({
 tabContainer: {
  flexDirection: "row",
  backgroundColor: "#1e1f20",
  paddingVertical: 8,
  paddingHorizontal: 6,
  borderRadius: 8,
  position: "relative",
  overflow: "hidden",
  marginBottom: 10,
 },
 tab: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 14,
  alignItems: "center",
  justifyContent: "center",
 },
 activeTab: {
  backgroundColor: "#d0bcff",
  borderRadius: 10,
 },
 text: {
  color: "#d0bcff",
 },
 activeText: {
  color: "#121212",
  fontWeight: "bold",
 },
});

export default HomeTab;
