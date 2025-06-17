import { Flex } from "@ui/Flex";
import Markdown from "react-native-markdown-display";
import { StyleSheet } from "react-native";
import { TypesPost } from "features/post/PostComponent/PostComponent";

const styles = StyleSheet.create({
 body: {
  color: "#fff",
  fontSize: 14,
  lineHeight: 24,
 },
 heading1: {
  fontSize: 24,
  fontWeight: "bold",
  marginVertical: 10,
  color: "#e0d7f7",
 },
 heading2: {
  fontSize: 18,
  fontWeight: "bold",
  marginVertical: 8,
  color: "#d4c1ff",
 },
 heading3: {
  fontSize: 16,
  fontWeight: "bold",
  marginVertical: 6,
  color: "#bba6e8",
 },
 heading4: {
  fontSize: 15,
  fontWeight: "bold",
  marginVertical: 5,
  color: "#a18fd0",
 },
 heading5: {
  fontSize: 14,
  fontWeight: "bold",
  marginVertical: 4,
  color: "#8c7ab8",
 },
 heading6: {
  fontSize: 13,
  fontWeight: "bold",
  marginVertical: 3,
  color: "#7a6aa3",
 },
 link: { color: "#9e77e6", textDecorationLine: "underline" },
 paragraph: { marginBottom: 10 },
 bullet_list: { marginLeft: 16, marginBottom: 10 },
 ordered_list: { marginLeft: 16, marginBottom: 10 },
 list_item: { color: "#fff", fontSize: 14, lineHeight: 24 },
 blockquote: {
  borderLeftWidth: 4,
  borderLeftColor: "#9e77e6",
  paddingLeft: 10,
  color: "#bba6e8",
  fontStyle: "italic",
  backgroundColor: "#23232b",
  marginVertical: 8,
 },
 code_inline: {
  backgroundColor: "#23232b",
  color: "#e0d7f7",
  borderRadius: 4,
  paddingHorizontal: 6,
  paddingVertical: 2,
  fontFamily: "monospace",
  fontSize: 13,
 },
 fence: {
  backgroundColor: "#212121",
  color: "#fff",
  borderRadius: 8,
  padding: 8,
  fontFamily: "monospace",
  marginVertical: 8,
  borderColor: "transparent",
 },
 hr: {
  borderBottomWidth: 1,
  borderBottomColor: "#444",
  marginVertical: 10,
 },
 table: {
  borderWidth: 1,
  borderColor: "#444",
  borderRadius: 4,
  marginVertical: 8,
 },
 th: {
  backgroundColor: "#2d2e2e",
  color: "#e0d7f7",
  fontWeight: "bold",
  padding: 6,
 },
 tr: {
  borderBottomWidth: 1,
  borderBottomColor: "#444",
 },
 td: {
  padding: 6,
  color: "#fff",
 },
 strong: {
  fontWeight: "bold",
  color: "#e0d7f7",
 },
 em: {
  fontStyle: "italic",
  color: "#bba6e8",
 },
 del: {
  textDecorationLine: "line-through",
  color: "#888",
 },
});

const TextPost = ({ item }: { item: TypesPost }) => {
 // const [previewData, setPreviewData] = useState(null);

 // const getLinkPreview = async () => {
 //   try {
 //     const data: any = await LinkPreview.getPreview(
 //       "https://www.youtube.com/watch?v=7oyGmCsvfgw"
 //     );
 //     setPreviewData(data);
 //   } catch (error) {
 //     console.error("Ошибка при получении предпросмотра:", error);
 //   }
 // };

 // ПОКА ПОРВЕМЕНИМ
 return (
  <Flex className="mt-4">
   <Markdown style={styles}>{item.content}</Markdown>
  </Flex>
 );
};

export default TextPost;
