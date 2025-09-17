import Avatar from "@ui/Avatar";
import { Flex } from "@ui/Flex";
import { StyleSheet, View } from "react-native";
import { Badge, Icon } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "stores/useAuthStore";
import { buildImageUrl } from "utils/urlUtils";

const TopBar = () => {
 const { user } = useAuthStore();
 return (
  <SafeAreaView>
   <View style={styles.container}>
    <View></View>
    <Flex gap={15} align="center">
     <Icon source={"magnify"} size={25} color="#fff" />
     <View style={styles.notificationContainer}>
      <Icon source={"bell"} size={20} color="#fff" />
      <Badge
       style={styles.badge}
      >
       18
      </Badge>
     </View>
     <Avatar
      userId={user.id}
      className="rounded-full"
      image={{ uri: buildImageUrl(user.avatar_url) }}
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
 notificationContainer: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
 },
 badge: {
  position: "absolute",
  top: -8,
  right: -8,
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: '#ff6b6b',
 },
});

export default TopBar;
