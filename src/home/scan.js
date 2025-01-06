import React from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, Input, Actionsheet, ShareIcon, ArrowForwardIcon, Center, Image, CheckCircleIcon } from 'native-base';
import { Alert, Keyboard, PermissionsAndroid, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, BoldText1 } from '../global-components/texts';
import { AcceptanceIcon, ArrowForward, BackIcon, DeleteIcon, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, ScanIcon, SecureIcon, SendVoucherIcon, ShopIcon, VoucherIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCodeScanner, useFrameProcessor } from 'react-native-vision-camera';
import { Loader } from '../global-components/loader';
import QRCode from 'react-native-qrcode-svg';
import { GetScannedDataService, ScanToPayService } from '../voucher/services';
import { CustomButtons } from '../global-components/buttons';

const Colors = Color()
export default function Scan({ navigation,route }) {
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
        GetScannedDataService(scannedToken)
            .then(response => {
                setLoader(false)
                if (response.success == false) {
                    Alert.alert("Error", response.message, [
                        {
                            onPress: () => {
                                navigation.pop()
                            },
                            text: "Exit"
                        }
                    ])
                } else {
                    setmerchant(response.data[0])
                    setbottomSheet(true)
                }
            })
            .catch(error => {
                setLoader(false)
                console.log(error)
            })
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
            return <Stack style={{
                height: 500,
            }} >

                <Camera
                    isActive={isCameraActive}     // Control camera activity
                    codeScanner={codeScanner}
                    device={device}
                    style={{ width: 500, height: "100%" }}

                />
                <Loader loading={loading} />
            </Stack>
        }
    }


    return (
        <>
            <SafeAreaView>
                <TouchableOpacity onPress={() => {
                    setDetectedCode(null); setIsCameraActive(true)
                }} >
                    <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                        <BackIcon />
                        <Text fontSize="lg" fontWeight="bold">Scan</Text>
                    </HStack>
                </TouchableOpacity>



            </SafeAreaView>
            {renderCamera()}


            <Actionsheet isOpen={bottomSheet} onClose={() => { navigation.pop(); setbottomSheet(!bottomSheet) }}>
                <Actionsheet.Content style={{
                    backgroundColor: "#fff",
                }} >

                    {detectedCode && <>

                        <BoldText text="Fund merchant" color="lightgrey" style={{}} />
                        <Stack mb={10} style={{
                            width: "100%",
                            padding: 15
                        }} >


                            {merchant &&
                                <TouchableOpacity
                                    style={{
                                        marginBottom: 4,
                                        paddingVertical: 10,
                                        paddingRight: 10,
                                        paddingLeft: 20,
                                        width: "100%",
                                        borderRadius: 5,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }} >
                                    <HStack alignItems="center" >
                                        {/* {console.log(merchant)} */}
                                        <Image
                                            style={{
                                                height: 35, width: 35, borderRadius: 40, zIndex: 1000, marginRight: 10
                                            }}
                                            source={{
                                                uri: merchant.merchant.img
                                            }} alt={"Image"} size="xl" />

                                        <VStack style={{
                                            width: "80%",
                                            justifyContent: "center"
                                        }} >
                                            <BoldText1 text={merchant.merchant.name} color={Colors.dark} />
                                            <BoldText text={`Amount will be added to the user's ${merchant.merchant.name} voucher balance`}
                                                color="lightgrey" />
                                        </VStack>
                                    </HStack>
                                    <CheckCircleIcon color={Colors.primary} />
                                </TouchableOpacity>
                            }

                            <TextInput
                                style={[styles.input, { marginTop: 40 }]}
                                placeholder="Enter amount"
                                keyboardType='numeric'
                                onChangeText={setAmount} />


                            {/* <TouchableOpacity onPress={() => {
                                onShare()
                                setbottomSheet(!bottomSheet)
                            }} style={{ marginTop: 120 }}  >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4} alignItems="center"  >
                                        <ShareIcon style={{ color: Colors.primary }} />
                                        <VStack>
                                            <BoldText1 text="Share merchant address" color={Colors.dark} />
                                            <BoldText text="Your friends can fun this merchant for you" color="grey" />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity> */}


                            <CustomButtons callBack={handleScanToPay}
                                primary={Amount < 100 ? false : true} Loading={loading}
                                LoadingText="Processing..."
                                width="100%" height={58} text="Continue"
                                Style={{
                                    marginTop: 50
                                }}
                            />


                        </Stack>

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