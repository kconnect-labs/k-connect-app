import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Flex } from "@ui/Flex";
import { FC, useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Portal } from "react-native-paper";

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
    <BottomSheetView style={styles.content}>
     <Flex direction="column" style={styles.flexContainer} gap={8}>
      <Flex direction="column" style={styles.flexContainer}>
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
  elevation: 9999,
  zIndex: 9999,
 },
 content: {
  paddingHorizontal: 8,
  paddingVertical: 8,
 },
 flexContainer: {
  width: '100%',
 },
});

export default Modal;
