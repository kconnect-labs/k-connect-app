import BottomSheet, {
 BottomSheetBackdrop,
 BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FC, useEffect, useRef, useCallback } from "react";
import { Portal } from "react-native-paper";
import { Flex } from "@ui/Flex";
import TextC from "@ui/TextC";
import { StyleSheet } from "react-native";

type Props = {
 isOpen: boolean;
 setIsOpen: (isOpen: boolean) => void;
 children: React.ReactNode;
};

export const Modal: FC<Props> = ({ isOpen, setIsOpen, children }) => {
 const sheetRef = useRef<BottomSheet>(null);

 useEffect(() => {
  if (isOpen) {
   sheetRef.current?.expand();
  } else {
   sheetRef.current?.close();
  }
 }, [isOpen]);

 const handleClose = useCallback(() => {
  setIsOpen(false);
 }, [setIsOpen]);

 const renderBackDrop = useCallback(
  (props: any) => (
   <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    pressBehavior="close"
   />
  ),
  []
 );

 return (
  <Portal theme={{ colors: { backdrop: "transparent" } }}>
   <BottomSheet
    ref={sheetRef}
    index={isOpen ? 0 : -1}
    style={styles.bottomSheet}
    enablePanDownToClose={true}
    backdropComponent={renderBackDrop}
    handleIndicatorStyle={{ backgroundColor: "#888888" }}
    backgroundStyle={{ backgroundColor: "#242229" }}
    overDragResistanceFactor={5}
    onChange={(index) => {
     if (index === -1) {
      setIsOpen(false);
     }
    }}
   >
    <BottomSheetView className="px-2 py-2">
     <Flex direction="column" className="w-full" gap={2}>
      <Flex direction="column" className="w-full">
       {children}
      </Flex>
     </Flex>
    </BottomSheetView>
   </BottomSheet>
  </Portal>
 );
};

const styles = StyleSheet.create({
 bottomSheet: {
  elevation: 9999999,
  zIndex: 9999999,
 },
});
