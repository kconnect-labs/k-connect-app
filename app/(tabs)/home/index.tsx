import { Layout } from "@ui/Layout";
import { StatusBar } from "expo-status-bar";
import HomeContent from "features/home/HomeContent";

export default function Home() {
 return (
  <Layout>
   <StatusBar style="auto" />
   <HomeContent />
  </Layout>
 );
}
