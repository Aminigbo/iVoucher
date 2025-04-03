import React, { useRef } from "react";
import { Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Text, Box, VStack, Input, ScrollView, HStack, Center, Stack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { appState } from "../state";
import QRCode from "react-native-qrcode-svg";
import { Touchable } from "react-native";
// import { onShare } from "../utilities";
import { captureRef } from 'react-native-view-shot';
import ShareLib from 'react-native-share';
import RNFS from 'react-native-fs';
import { DownloadIcon } from "lucide-react-native";


const Colors = Color()

const MerchantQr = ({ navigation }) => {
    const { User } = appState()
    const ShareRef = useRef()

    const onShare = async () => {
        try {
            // Capture the QR code view
            const uri = await captureRef(ShareRef, {
                format: 'png',
                quality: 1,
            });
            // console.log("onShare", uri)

            // setviewCylinder(!viewCylinder)
            // Share the captured image
            await ShareLib.open({
                url: uri,
                message: "Enjoy seamless transactions with Pocket Voucher.",
            });
            // Delete the image from cache after sharing
            await RNFS.unlink(uri);
            console.log("Image deleted from cache");

        } catch (error) {
            // Delete the image from cache after sharing
            await RNFS.unlink(uri);
            console.log("Image deleted from cache");
            Alert.alert("Error", error.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA", padding: 16 }}>
            {/* {console.log(User)} */}
            <HStack alignItems="center" justifyContent="space-between" space={5} mb={10} >
                <HStack alignItems="center" justifyContent="flex-start" space={5}  >
                    <TouchableOpacity onPress={() => navigation.replace("Onboarding")}>
                        <BackIcon />
                    </TouchableOpacity>
                    {/* <Text style={Styles.headerText}>Address Details</Text> */}
                </HStack>
                <TouchableOpacity
                    style={{
                        padding: 15
                    }}
                    onPress={() => {
                        onShare(ShareRef)
                    }}>
                    <DownloadIcon />
                </TouchableOpacity>
            </HStack>

            <Pressable
                ref={ShareRef}
                // onPress={() => {
                //     onShare(ShareRef)
                // }}
                style={{
                    flex: 1,
                    height: 700,
                    backgroundColor: Colors.accent,
                    padding: 30,
                    borderRadius: 10,
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                    justifyContent: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}  >
                <Center>
                    {console.log(User.bankInfo)}
                    <QRCode
                        value={`${JSON.stringify({
                            bank_name: User.bankInfo.bank_name,
                            bank_code: User.bankInfo.bank_code,
                            account_number: User.bankInfo.account_number,
                            account_name: User.bankInfo.account_name,
                            logo: User.logo
                        })}.-.pocketvoucher`}
                        // logo={{ uri: base64Logo }}
                        logoSize={30}
                        logoBackgroundColor='transparent'
                        size={300}
                    />

                    <Text style={[Styles.headerText, {
                        marginTop: 40,
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: Colors.dark
                    }]}>Aminigbo Enterprise</Text>
                    <Text style={{
                        textAlign: "center",
                        marginTop: 30,
                        color: Colors.dark,
                    }}>
                        We believe in fast and seamless transactions.
                    </Text>
                    <Text style={{
                        textAlign: "center",
                        color: Colors.dark,
                    }}>
                        Just scan the QR code to make payment.
                    </Text>
                </Center>

                <Text style={{ marginTop: 50 }}>Powered by Pocket Voucher</Text>

            </Pressable>
        </SafeAreaView>
    );
};

export default MerchantQr;

const Styles = StyleSheet.create({
    box: {
        marginVertical: 8,
    },
    input: {
        backgroundColor: "gray.100",
        borderRadius: 6,
        padding: 13,
        fontSize: 18,
        color: "gray",
        borderWidth: 0.5,
        borderColor: "lightgray",
        backgroundColor: Colors.accent,
    },
    headerText: { fontSize: 20, fontWeight: 'bold' },
})