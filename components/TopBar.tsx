import { View, StyleSheet } from "react-native";
import TextC from "@ui/TextC";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge, Icon } from "react-native-paper";
import { Flex } from "@ui/Flex";
import { Image } from "expo-image";
import useAuthStore from "src/stores/useAuthStore";
import Avatar from "@ui/Avatar";

const TopBar = () => {
 const { user } = useAuthStore();
 return (
  <SafeAreaView>
   <View style={styles.container}>
    <View></View>
    <Flex gap={15} align="center">
     <Icon source={"magnify"} size={25} color="#fff" />
     <View>
      <Icon source={"bell"} size={20} color="#fff" />
      <Badge
       style={{
        position: "absolute",
        top: -10,
        right: -10,
        borderRadius: 10,
        width: 20,

        height: 18,
        justifyContent: "center",
        alignItems: "center",
       }}
      >
       18
      </Badge>
     </View>
     <Avatar
      userId={user.id}
      className="rounded-full"
      image={{ uri: `https://k-connect.ru${user.avatar_url}` }}
     />
    </Flex>
   </View>
  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
  width: "100%",
  padding: 16,
  backgroundColor: "#1e1f20",
  zIndex: 100,
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
 },
});

export default TopBar;
