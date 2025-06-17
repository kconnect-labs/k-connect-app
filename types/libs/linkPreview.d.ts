declare module 'react-native-link-preview' {
  interface LinkPreviewData {
    title: string;
    description: string;
    image: string;
    url: string;
  }

  export default {
    getPreview(url: string): Promise<LinkPreviewData>;
  };
}
