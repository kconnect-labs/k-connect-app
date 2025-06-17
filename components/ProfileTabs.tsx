import React, { useCallback, useMemo, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ProfileTabKey, profileTabs } from "types/tabs";

type Props = {
 activeTab: ProfileTabKey;
 setActiveTab: (tab: ProfileTabKey) => void;
};

const ProfileTabs = React.memo(({ activeTab, setActiveTab }: Props) => {
 const [tabAnimation] = useState(
  new Animated.Value(profileTabs.indexOf(activeTab))
 );

 const animateTabChange = useCallback(
  (tab: ProfileTabKey) => {
   Animated.timing(tabAnimation, {
    toValue: profileTabs.indexOf(tab),
    duration: 300,
    useNativeDriver: true,
   }).start();

   setActiveTab(tab);
  },
  [tabAnimation, setActiveTab]
 );

 const indicatorTranslateX = tabAnimation.interpolate({
  inputRange: [0, 1, 2],
  outputRange: [0, 120, 240],
 });

 return (
  <View style={styles.tabContainer} className="overflow-hidden">
   {profileTabs.map((tab, index) => (
    <TouchableOpacity
     key={tab}
     onPress={() => animateTabChange(tab)}
     style={[styles.tab, activeTab === tab && styles.activeTab]}
    >
     <Text style={activeTab === tab ? styles.activeText : styles.text}>
      {tab === "posts" ? "Публикации" : tab === "info" ? "Информация" : "Стена"}
     </Text>
    </TouchableOpacity>
   ))}

   <Animated.View
    style={[
     styles.indicator,
     {
      width: `${100 / profileTabs.length}%`,
      transform: [{ translateX: indicatorTranslateX }],
     },
    ]}
   />
  </View>
 );
});

const ProfileContent = React.memo(
 ({ activeTab }: { activeTab: ProfileTabKey }) => {
  const [tabAnimation] = useState(new Animated.Value(1));

  const cachedTabs = useMemo(() => {
   return {
    posts: <Text>Публикации Content</Text>,
    info: <Text>Информация Content</Text>,
    wall: <Text>Стена Content</Text>,
   };
  }, []);

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
     {cachedTabs[activeTab]}
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
 },
 tab: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 12,
  alignItems: "center",
  justifyContent: "center",
 },
 activeTab: {
  borderBottomWidth: 2,
  borderBottomColor: "#d0bcff",
 },
 text: {
  color: "#999",
  fontSize: 12,
 },
 activeText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 12,
 },
 indicator: {
  position: "absolute",
  bottom: 0,
  height: 2,
  backgroundColor: "#d0bcff",
  width: "33%",
 },
});

export { ProfileContent, ProfileTabs };

