import Link from "react-native-link-preview";
export const getLinkPreview = async (url: string) => {
  try {
    return await Link.getPreview(url);
  } catch (error) {
    console.error("Ошибка при получении предпросмотра:", error);
  }
};
