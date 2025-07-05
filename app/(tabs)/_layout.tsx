import { SVG_HOME, SVG_PROFILE, SVG_SHARE_NODES } from "assets/svg/svg";
import { Tabs, usePathname } from "expo-router";
import { TouchableOpacity } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MessengerTab from "../../components/MessengerTab";
import "../../global.css";

export default function TabLayout() {
 const pathname = usePathname();
 const isChatScreen = pathname.includes('/messenger/chat/');
 
 return (
  <PaperProvider>
   <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
    <Tabs
     screenOptions={{
      sceneStyle: {
       backgroundColor: "#121212",
      },
      headerShown: false,
      freezeOnBlur: true,
      tabBarActiveTintColor: "#d0bcff",
      tabBarInactiveTintColor: "#888888",
      tabBarStyle: {
       backgroundColor: "#222222",
       borderTopLeftRadius: 8,
       borderTopRightRadius: 8,
       paddingBottom: 10,
       height: 65,
       paddingTop: 10,
       borderTopWidth: 0,
       position: "absolute",
       display: isChatScreen ? "none" : "flex",
      },
      tabBarItemStyle: {
       borderRadius: 15,
       marginHorizontal: 10,
      },
      tabBarButton: (props: any) => (
       <TouchableOpacity {...props} activeOpacity={0.4} />
      ),
     }}
    >
     <Tabs.Screen
      name="home"
      options={{
       title: "Лента",
       tabBarIcon: ({ focused }) => (
        <SVG_HOME size={25} fill={focused ? "#d0bcff" : "#888888"} />
       ),
      }}
     />
     <Tabs.Screen
      name="messenger"
      options={{
       title: "Мессенджер",
       tabBarLabel: "Мессенджер",
       tabBarIcon: ({ focused }) => (
        <MessengerTab focused={focused} />
       ),
      }}
     />
     <Tabs.Screen
      name="profile"
      options={{
       title: "Профиль",
       tabBarIcon: ({ focused }) => (
        <SVG_PROFILE size={25} fill={focused ? "#d0bcff" : "#888888"} />
       ),
      }}
     />
     <Tabs.Screen
      name="more"
      options={{
       title: "Ещё",
       tabBarIcon: ({ focused }) => (
        <SVG_SHARE_NODES size={25} fill={focused ? "#d0bcff" : "#888888"} />
       ),
      }}
     />
    </Tabs>
   </SafeAreaView>
  </PaperProvider>
 );
}
