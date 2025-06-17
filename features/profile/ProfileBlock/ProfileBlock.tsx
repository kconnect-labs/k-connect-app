import { Flex } from "@ui/Flex";
import { View } from "react-native";
import useAuthStore from "stores/useAuthStore";
import { Root } from "types/profile";
import {
    ProfileActivity,
    ProfileDescription,
    ProfileFollow,
    ProfileInfo,
    ProfilePhotos,
    ProfileStatusBadges,
    ProfileSubInfo,
    ProfileUsernames,
} from "./components";
import ProfileLinks from "./components/ProfileLinks";

export const ProfileBlock = ({ data }: { data: Root | null }) => {
 if (!data) return null;
 const { user } = useAuthStore();

 return (
  <Flex
   direction="column"
   style={{
    borderWidth: 2,
    shadowColor: data.user.status_color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderColor: `${data.user.status_color}`,
    maxWidth: '100%',
    overflow: 'hidden'
   }}
   className="bg-[#1e1f20] rounded-xl w-full"
  >
   <ProfilePhotos data={data} />
   <Flex direction="column" gap={8} className="w-full p-3">
    <ProfileInfo data={data} />
    <ProfileStatusBadges data={data} />
    <ProfileUsernames data={data} />
    {data.user.about && <ProfileDescription data={data} />}
    <ProfileActivity data={data} />
    <ProfileSubInfo data={data} />
    <View className="w-full h-[1px] rounded-full bg-[#2d2e2e]" />
    <ProfileLinks data={data} />

    {data.user.username !== user?.username && <ProfileFollow data={data} />}
   </Flex>
  </Flex>
 );
};
