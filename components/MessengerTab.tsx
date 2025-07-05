import { SVG_MESSAGE } from "assets/svg/svg";
import { useMessenger } from "contexts/MessengerContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MessengerTabProps {
  focused: boolean;
}

const MessengerTab: React.FC<MessengerTabProps> = ({ focused }) => {
  const { getTotalUnreadCount } = useMessenger();
  const unreadCount = getTotalUnreadCount();

  return (
    <View style={styles.container}>
      <SVG_MESSAGE size={25} fill={focused ? "#d0bcff" : "#888888"} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MessengerTab; 