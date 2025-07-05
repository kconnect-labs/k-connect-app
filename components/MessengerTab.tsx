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
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1e1f20',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MessengerTab; 