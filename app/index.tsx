import { View, Text, Button } from "react-native";
import React from "react";
import { router } from "expo-router";

const index = () => {
 return (
  <View>
   <Button
    title="123"
    color={"red"}
    onPress={() => router.navigate("/(tabs)/more")}
   />
  </View>
 );
};

export default index;
