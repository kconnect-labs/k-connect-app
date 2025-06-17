import { Flex } from "@ui/Flex";
import { Layout } from "@ui/Layout";
import { StatusBar } from "expo-status-bar";
import MoreContent from "features/more/MoreContent";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native-paper";
import { customFonts } from "@assets/fonts/fonts";

export default function More() {
 const [fontsLoaded] = useFonts(customFonts);

 if (!fontsLoaded) {
  return <ActivityIndicator size="large" color="#0000ff" />;
 }

 return (
  <Layout>
   <StatusBar style="auto" />
   <MoreContent />
  </Layout>
 );
}
