import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { Color } from "./colors";
import { CloseIcon } from "./icons";


const COLORS = Color()
export default function ModalPop({ open, onClose, children }) {
    return (
        <>
            <Modal animationType="slide" visible={open} transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.orderModalContainer}>
                        {children}
                        {onClose && <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
                            <CloseIcon name="closecircle" size={24} color={COLORS.primary} />
                        </TouchableOpacity>}

                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    //    modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    orderModalContainer: {
        width: "90%",
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 5,
        elevation: 10,
    },
    closeModalButton: {
        position: "absolute",
        bottom: -20,
        left: "50%",
        transform: [{ translateX: 0 }],
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 50,
        borderColor: COLORS.gray,
        borderWidth: 1,
        zIndex: 10,
    },
    closeModalButtonText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.black,
        textAlign: "center",
    },
});
