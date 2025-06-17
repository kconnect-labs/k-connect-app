import { Modal } from "components/Modal";
import NotifyButton from "components/NotifyButton";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalProvider } from "@gorhom/portal";
import { Provider as PaperProvider } from "react-native-paper";
import { ModalWrapper } from "components/ModalWrapper";

export default function RootLayout() {
 return (
  <GestureHandlerRootView style={{ flex: 1 }}>
   <SafeAreaProvider>
    <PaperProvider>
     <PortalProvider>
      <Slot />
      <ModalWrapper />
      <NotifyButton />
     </PortalProvider>
    </PaperProvider>
   </SafeAreaProvider>
  </GestureHandlerRootView>
 );
}
