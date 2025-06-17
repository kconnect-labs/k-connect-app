import TextC from "@ui/TextC";
import React from "react";
import { Text, Linking, StyleSheet } from "react-native";

const styles = StyleSheet.create({
 bold: { fontWeight: "bold" },
 link: { color: "#9e77e6", textDecorationLine: "underline" },
});

export function renderMarkdown(line: string): React.ReactNode[] {
 const elements: React.ReactNode[] = [];

 let remaining = line;
 const regex = /(\*\*(.*?)\*\*|<((https?:\/\/)[^>\s]+)>)/g;
 let match: RegExpExecArray | null;
 let index = 0;

 while ((match = regex.exec(line)) !== null) {
  const [full, boldMatch, boldText, linkMatch, _] = match;
  const start = match.index;
  const end = regex.lastIndex;

  // Добавляем текст до совпадения
  if (start > index) {
   elements.push(
    <TextC key={`text-${index}`}>{line.slice(index, start)}</TextC>
   );
  }

  if (boldMatch) {
   elements.push(
    <TextC key={`bold-${start}`} style={styles.bold}>
     {boldText}
    </TextC>
   );
  }
  if (linkMatch) {
   elements.push(
    <TextC
     key={`link-${start}`}
     style={styles.link}
     onPress={() => Linking.openURL(linkMatch)}
    >
     {linkMatch}
    </TextC>
   );
  }

  index = end;
  remaining = line.slice(index);
 }

 if (index < line.length) {
  elements.push(<TextC key={`last-${index}`}>{line.slice(index)}</TextC>);
 }

 return elements;
}
