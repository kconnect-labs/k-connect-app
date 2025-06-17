import { Layout } from "@ui/Layout";
import { StatusBar } from "expo-status-bar";
import ProfileContent from "features/profile/ProfileContent";

export default function Profile() {
 return (
  <Layout>
   <StatusBar style="auto" />
   <ProfileContent />
  </Layout>
 );
}
