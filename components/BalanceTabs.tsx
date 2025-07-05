import React, { useCallback, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Icon } from "react-native-paper";

type BalanceTabKey = "history" | "assets" | "subscription";

const balanceTabs: BalanceTabKey[] = ["history", "assets", "subscription"];

type Props = {
 activeTab: BalanceTabKey;
 setActiveTab: (tab: BalanceTabKey) => void;
};

const BalanceTabs = React.memo(({ activeTab, setActiveTab }: Props) => {
 const [tabAnimation] = useState(
  new Animated.Value(balanceTabs.indexOf(activeTab))
 );

 const animateTabChange = useCallback(
  (tab: BalanceTabKey) => {
   Animated.timing(tabAnimation, {
    toValue: balanceTabs.indexOf(tab),
    duration: 300,
    useNativeDriver: true,
   }).start();

   setActiveTab(tab);
  },
  [tabAnimation, setActiveTab]
 );

 const indicatorTranslateX = tabAnimation.interpolate({
  inputRange: [0, 1, 2],
  outputRange: [0, 120, 240], // Adjust these values based on actual tab widths
 });

 return (
  <View style={styles.tabContainer} className="overflow-hidden">
   {balanceTabs.map((tab, index) => (
    <TouchableOpacity
     key={tab}
     onPress={() => animateTabChange(tab)}
     style={[styles.tab, activeTab === tab && styles.activeTab]}
    >
     <Icon
      source={
       tab === "history"
        ? "text-box-outline"
        : tab === "assets"
        ? "diamond-outline"
        : "lightning-bolt"
      }
      size={20}
      color={activeTab === tab ? "#d0bcff" : "#ccc"}
     />
     <Text style={activeTab === tab ? styles.activeText : styles.text}>
      {
       tab === "history"
        ? "История"
        : tab === "assets"
        ? "Активы"
        : "Подписка"
      }
     </Text>
    </TouchableOpacity>
   ))}

   <Animated.View
    style={[
     styles.indicator,
     {
      width: `${100 / balanceTabs.length}%`,
      transform: [{ translateX: indicatorTranslateX }],
     },
    ]}
   />
  </View>
 );
});

const BalanceTabContent = React.memo(
 ({ activeTab }: { activeTab: BalanceTabKey }) => {
  const [tabAnimation] = useState(new Animated.Value(1));

  React.useEffect(() => {
   Animated.timing(tabAnimation, {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
   }).start(() => {
    Animated.timing(tabAnimation, {
     toValue: 1,
     duration: 150,
     useNativeDriver: true,
    }).start();
   });
  }, [activeTab, tabAnimation]);

  return (
   <View style={{ flex: 1 }}>
    <Animated.View style={{ opacity: tabAnimation }}>
     {activeTab === "history" && <Text>История контент</Text>}
     {activeTab === "assets" && <Text>Активы контент</Text>}
     {activeTab === "subscription" && <Text>Подписка контент</Text>}
    </Animated.View>
   </View>
  );
 }
);

const styles = StyleSheet.create({
 tabContainer: {
  flexDirection: "row",
  backgroundColor: "#1e1f20",
  borderRadius: 8,
  position: "relative",
  height: 60,
 },
 tab: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 12,
  alignItems: "center",
  justifyContent: "center",
 },
 activeTab: {
  // No specific border, handled by indicator
 },
 text: {
  color: "#999",
  fontSize: 10,
 },
 activeText: {
  color: "#d0bcff",
  fontWeight: "600",
  fontSize: 10,
 },
 indicator: {
  position: "absolute",
  bottom: 0,
  height: 2,
  backgroundColor: "#d0bcff",
  // width: '33%', // This will be calculated dynamically
  width: 120,
 },
});

export { BalanceTabContent, BalanceTabs };
