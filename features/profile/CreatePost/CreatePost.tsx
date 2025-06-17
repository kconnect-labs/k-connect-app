import { Flex } from "@ui/Flex";
import Avatar from "@ui/Avatar";
import { Button } from "react-native-paper";
import { TextInput, View } from "react-native";
import { useCreatePost } from "@hooks/useCreatePost";
import { useState } from "react";
import useAuthStore from "stores/useAuthStore";

const CreatePost = () => {
 const [textPost, setTextPost] = useState<string>("");
 const { createPost } = useCreatePost();
 const [loading, setLoading] = useState<boolean>(false);
 const { user } = useAuthStore();
 const handleCreatePost = () => {
  if (!textPost) return;
  setLoading(true);
  createPost(textPost).then(() => {
   setTextPost("");
   setLoading(false);
  });
 };
 return (
  <Flex direction="column" className="bg-[#1e1f20] rounded-xl w-full p-4">
   <Flex justify="space-between" gap={8} className="w-full">
    <Avatar
     userId={user.id}
     size={20}
     image={{ uri: `https://k-connect.ru${user.photo}` }}
    />
    <View className="flex-1">
     <TextInput
      multiline
      value={textPost}
      onChangeText={(text) => setTextPost(text)}
      numberOfLines={3}
      placeholder="Что у вас нового?"
      placeholderTextColor="#84828b"
      style={{
       backgroundColor: "#181818",
       borderRadius: 8,
       padding: 4,
       paddingLeft: 15,
       fontSize: 14,
       lineHeight: 18,
       height: 45,
       color: "#fff",
      }}
     />
    </View>
   </Flex>
   <Flex justify="space-between" className="w-full mt-4" align="center">
    <Flex>
     <Button
      icon="image"
      onPress={() => {}}
      textColor="#888"
      mode="text"
      compact
      style={{ marginRight: 8 }}
     >
      Медиа
     </Button>
     <Button
      icon="music"
      onPress={() => {}}
      mode="text"
      compact
      textColor="#888"
     >
      Музыка
     </Button>
    </Flex>
    <Flex>
     <Button
      onPress={() => {
       handleCreatePost();
      }}
      mode="contained"
      textColor="#000"
      buttonColor="#d0bcff"
      loading={loading}
     >
      Опубликовать
     </Button>
    </Flex>
   </Flex>
  </Flex>
 );
};

export default CreatePost;
