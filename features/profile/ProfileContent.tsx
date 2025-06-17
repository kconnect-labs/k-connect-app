import { usePosts } from "@hooks/usePosts";
import { useProfile } from "@hooks/useProfile";
import { ProfileTabs } from "components/ProfileTabs";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { ProfileTabKey } from "types/tabs";
import { ProfileBlock } from "./ProfileBlock/ProfileBlock";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import ProfilePosts from "./ProfilePosts/ProfilePosts";

const MemoizedProfilePosts = React.memo(ProfilePosts);

const ProfileContent = ({ id }: { id?: number }) => {
 const { data: dataPosts, refetch: refetchPosts } = usePosts({ id });
 const { data: dataProfile, refetch: refetchProfile } = useProfile({ id });

 const [refreshing, setRefreshing] = useState<boolean>(false);
 const [activeTab, setActiveTab] = useState<ProfileTabKey>("posts");

 const memoizedDataProfile = useMemo(() => dataProfile, [dataProfile?.user.id]);
 const memoizedDataPosts = useMemo(() => dataPosts, [dataPosts?.posts]);

 const handleTabChange = useCallback((tab: ProfileTabKey) => {
  setActiveTab(tab);
 }, []);

 if (!dataPosts && !dataProfile) return null;

 const onRefresh = async () => {
  setRefreshing(true);
  await Promise.all([refetchPosts(), refetchProfile()]);
  setRefreshing(false);
 };

 const renderItem = ({ item }: any) => {
  if (item.type === "tabs") {
   return <ProfileTabs activeTab={activeTab} setActiveTab={handleTabChange} />;
  }

  if (item.type === "profileBlock") {
   return <ProfileBlock data={memoizedDataProfile} />;
  }

  if (item.type === "posts" && activeTab === "posts") {
   return <MemoizedProfilePosts data={memoizedDataPosts} id={id} />;
  }
  if (item.type === "posts" && activeTab === "info") {
   return <ProfileInfo data={dataProfile} />;
  }

  return null;
 };

 const data = [
  { key: "profileBlock", type: "profileBlock" },
  { key: "tabs", type: "tabs" },
  { key: "posts", type: "posts" },
 ];

 return (
  <FlatList
   data={data}
   keyExtractor={(item) => item.key}
   renderItem={renderItem}
   refreshing={refreshing}
   contentContainerClassName="gap-4"
   onRefresh={onRefresh}
   refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
   }
   contentContainerStyle={{ 
    padding: 8,
    paddingBottom: 60,
    maxWidth: '100%',
    overflow: 'hidden'
   }}
   ListFooterComponent={() => (
    <View>
     {refreshing && (
      <View
       style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
       }}
      >
       <ActivityIndicator color="#d4c1ff" />
      </View>
     )}
    </View>
   )}
  />
 );
};

export default ProfileContent;
