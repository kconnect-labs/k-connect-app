import { PortalProvider } from "@gorhom/portal";
import { ModalWrapper } from "components/ModalWrapper";
import NotifyButton from "components/NotifyButton";
import { MessengerProvider } from "contexts/MessengerContext";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
 return (
  <GestureHandlerRootView style={{ flex: 1 }}>
   <SafeAreaProvider>
    <PaperProvider>
     <MessengerProvider>
      <PortalProvider>
       <Slot />
       <ModalWrapper />
       <NotifyButton />
      </PortalProvider>
     </MessengerProvider>
    </PaperProvider>
   </SafeAreaProvider>
  </GestureHandlerRootView>
 );
}
