import { View, Text } from 'react-native';
import React, { FC } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
type Props = {
  children: React.ReactNode;
};
export const Layout: FC<Props> = ({ children }) => {
  return <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>{children}</SafeAreaView>;
};
