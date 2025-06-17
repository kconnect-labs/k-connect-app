import { View, Text } from "react-native";
import React from "react";
import TextC from "../../ui/TextC";
import { Layout } from "../../ui/Layout";
import { StatusBar } from "expo-status-bar";
import ProfileContent from "../../features/profile/ProfileContent";

const ProfileScreen = () => {
 return (
  <Layout>
   <StatusBar style="auto" />
   <ProfileContent />
  </Layout>
 );
};

export default ProfileScreen;
