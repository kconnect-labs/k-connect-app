import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  message: any;
  isOwn: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, isOwn }) => {
  return (
    <View style={[styles.container, isOwn ? styles.own : styles.other]}>      
      {message.content && (
        <Text style={styles.text}>{message.content}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 4,
  },
  own: {
    backgroundColor: "#d0bcff",
    alignSelf: "flex-end",
  },
  other: {
    backgroundColor: "#2a2a2a",
    alignSelf: "flex-start",
  },
  text: { color: "#fff" },
});

export default MessageBubble; 