import { useModalStore } from "stores/modalStore";
import { Modal } from "./Modal";

export function ModalWrapper() {
 const { isOpen, content, closeModal } = useModalStore();

 return (
  <Modal isOpen={isOpen} setIsOpen={closeModal}>
   {content}
  </Modal>
 );
}
