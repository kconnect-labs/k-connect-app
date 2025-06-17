import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useState } from "react";
import FriendsContent from "./FriendsContent/FriendsContent";
import FollowingContent from "./FollowingContent/FollowingContent";
import { Header } from "components/Header";

const FriendsRoute = () => <FriendsContent />;

const FollowingRoute = () => <FollowingContent />;

export default function FollowInfoContent() {
 const [index, setIndex] = useState(0);
 const [routes] = useState([
  { key: "friends", title: `Друзья` },
  { key: "following", title: `Подписки` },
 ]);

 const renderScene = SceneMap({
  friends: FriendsRoute,
  following: FollowingRoute,
 });

 const renderTabBar = (props: any) => (
  <TabBar
   {...props}
   indicatorStyle={{ backgroundColor: "#d0bcff" }}
   style={{ backgroundColor: "#131313" }}
   labelStyle={{ color: "#fff" }}
   activeColor="#d0bcff"
  />
 );

 return (
  <SafeAreaView className="flex-1">
   <Header text="Друзья / Подписки" />
   <TabView
    navigationState={{ index, routes }}
    renderScene={renderScene}
    onIndexChange={setIndex}
    renderTabBar={renderTabBar}
   />
  </SafeAreaView>
 );
}
