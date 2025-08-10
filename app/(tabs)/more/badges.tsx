import { Flex } from "@ui/Flex";
import { Layout } from "@ui/Layout";
import { StatusBar } from "expo-status-bar";
import BadgesContent from "features/badges/BadgesContent";

const badges = () => {
 return (
  <Layout>
   <StatusBar style="auto" />
   <Flex className="m-5 mt-10">
    <BadgesContent />
   </Flex>
  </Layout>
 );
};

export default badges;
