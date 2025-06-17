import { Layout } from "@ui/Layout";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ProfileContent from "features/profile/ProfileContent";

const PorfileUserId = () => {
 const { userId }: { userId: string } = useLocalSearchParams();
 return (
  <Layout>
   <StatusBar style="auto" />
   <ProfileContent id={parseInt(userId)} />
  </Layout>
 );
};

export default PorfileUserId;
