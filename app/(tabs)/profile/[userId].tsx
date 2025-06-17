import { Layout } from "@ui/Layout";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ProfileContent from "features/profile/ProfileContent";

const PorfileUserId = () => {
 const { id }: { id: string } = useLocalSearchParams();
 return (
  <Layout>
   <StatusBar style="auto" />
   <ProfileContent id={parseInt(id)} />
  </Layout>
 );
};

export default PorfileUserId;
