import React from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, Input, Actionsheet, ShareIcon, ArrowForwardIcon, Center, Image, CheckCircleIcon } from 'native-base';
import { Alert, Keyboard, PermissionsAndroid, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { AcceptanceIcon, ArrowForward, BackIcon, DeleteIcon, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, ScanIcon, SecureIcon, SendVoucherIcon, ShopIcon, VoucherIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCodeScanner, useFrameProcessor } from 'react-native-vision-camera';
import { Loader } from '../global-components/loader';
import QRCode from 'react-native-qrcode-svg';
import { GetScannedDataService, ScanToPayService } from '../voucher/services';
import { CustomButtons } from '../global-components/buttons';
import { formatDate, NumberWithCommas } from '../utilities';

const Colors = Color()
export default function Scan({ navigation, route }) {
    const [User, setUser] = React.useState(route.params.user)
    const [merchant, setmerchant] = React.useState(null)
    const [hasCameraPermission, setHasCameraPermission] = React.useState(false);
    const [isCameraActive, setIsCameraActive] = React.useState(true);
    const [detectedCode, setDetectedCode] = React.useState(null);
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [loading, setLoader] = React.useState(false)
    const [Amount, setAmount] = React.useState("")



    const device = useCameraDevice('back')

    const [hasPermission, setHasPermission] = React.useState(false);

    // Request permission
    React.useEffect(() => {
        // (async () => {
        //     const status = await Camera.requestCameraPermission();
        //     setHasPermission(status === 'authorized');
        // })();
    }, []);


    function handleGetScannedData(scannedToken) {

        let split = scannedToken.split(".-.")

        if (split.length > 1) {
            let merchantData = JSON.parse(split[0])

            const Payload = {
                bank_name: merchantData.bank_name,
                bank_code: merchantData.bank_code,
                account_number: merchantData.account_number,
                account_name: merchantData.account_name,
            }
            setLoader(false)
            navigation.replace("Amount-page", { data: Payload })
        } else {
            Alert.alert("Error", "Invalid Merchant code", [
                {
                    onPress: () => {
                        setLoader(false)
                        navigation.pop()
                    },
                    text: "Exit"
                }
            ])
        }

    }

    function handleScanToPay() {
        if (Amount < 100) {

        } else {
            Keyboard.dismiss()
            setLoader(true)
            ScanToPayService({ payer: User, receiver: merchant.user, amount: Amount, merchant: merchant.merchant.id })
                .then(response => {
                    setLoader(false)
                    if (response.success == false) {
                        Alert.alert("Error", response.message, [
                            {
                                onPress: () => {
                                    setLoader(false)
                                },
                                text: "Exit"
                            }
                        ])
                    } else {
                        Alert.alert("Success", response.message, [
                            {
                                onPress: () => {
                                    setmerchant(null)
                                    setbottomSheet(false)
                                    navigation.pop()
                                },
                                text: "Done"
                            }
                        ])

                        console.log("Done")

                    }
                })
                .catch(error => {
                    setLoader(false)
                    // console.log(error)
                })
        }
    }


    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (codes.length > 0 && !detectedCode) {
                const scannedCode = codes[0].value
                setDetectedCode(scannedCode);       // Save the detected code
                setIsCameraActive(false);           // Stop the camera
                // console.log(`QR Code detected: ${scannedCode}`);
                setLoader(true)

                handleGetScannedData(scannedCode)
            }
        }
    })



    function renderCamera() {
        if (device == null) {
            console.log("device is null");

            return <Center>
                <BoldText1 text="No camera available" />
            </Center>
        }
        else {
            return <Center style={{
                height: 400,
            }} >

                <Camera
                    isActive={isCameraActive}     // Control camera activity
                    codeScanner={codeScanner}
                    device={device}
                    style={{ width: 300, height: 300 }}

                />
                <Loader loading={loading} />
            </Center>
        }
    }


    return (
        <>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "#fff"
            }} >
                <TouchableOpacity onPress={() => {
                    setDetectedCode(null); setIsCameraActive(true)
                }} >
                    <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                        <BackIcon />
                        <Text fontSize="lg" fontWeight="bold">Scan</Text>
                    </HStack>
                </TouchableOpacity>

                {renderCamera()}

                <Stack space={5} p={4} style={{
                    backgroundColor: "#fff",
                    borderTopWidth: 1,
                    borderTopColor: "#ddd"
                }} >
                    <BoldText text="Tips" color="lightgrey" style={{}} />

                    <Text fontSize="sm">⚠️ Never share passwords, OTPs, or account details.</Text>
                    <Text fontSize="sm">✅ Double-check recipient info before confirming transfers.</Text>
                    <Text fontSize="sm">📶 Avoid public Wi-Fi for financial transactions.</Text>
                    <Text fontSize="sm">🔒 Add an extra layer of security for logins and transactions.</Text>


                </Stack>
            </SafeAreaView>


            <Actionsheet isOpen={bottomSheet} onClose={() => { navigation.pop(); setbottomSheet(!bottomSheet) }}>
                <Actionsheet.Content style={{
                    backgroundColor: "#fff",
                }} >

                    {detectedCode && merchant && <>


                        <BoldText text={merchant.token} color="lightgrey" style={{}} />

                        <Text fontSize="5xl" color="#000" fontWeight="medium">₦{NumberWithCommas(merchant.amount)}</Text>

                        <BoldText text="Created" color="lightgrey" style={{ marginVertical: 15 }} />

                        <Text fontSize="sm" color="#000" >{formatDate(merchant.created_at)}</Text>

                        <CustomButtons callBack={handleScanToPay}
                            primary={Amount < 100 ? true : true} Loading={loading}
                            LoadingText="Processing..."
                            width="100%" height={58} text="Resolve"
                            Style={{
                                marginTop: 50
                            }}
                        />


                    </>}



                </Actionsheet.Content>
            </Actionsheet>

        </>
    );
}


const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },

    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
});