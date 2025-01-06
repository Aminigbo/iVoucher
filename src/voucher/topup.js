import React from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, Input, CheckCircleIcon, Actionsheet, ArrowForwardIcon } from 'native-base';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { AcceptanceIcon, BackIcon, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, ScanIcon, SecureIcon, SendVoucherIcon, ShopIcon, VoucherIcon } from '../global-components/icons';
import VoucherComponent from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButtons } from '../global-components/buttons';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { connect } from 'react-redux';
import { User } from '../redux';
import { TopUpService } from './services';
import ModalPop from '../global-components/modal';
import { Loader } from '../global-components/loader';
import { appState } from '../state';

const Colors = Color()


function Topup({ route, navigation }) {
    const { User, login } = appState()
    const [amount, setAmount] = React.useState("")
    const [data, setdata] = React.useState(route.params)
    const [loading, setLoading] = React.useState(false)
    const [modalData, setmodalData] = React.useState({
        isTrue: false,
        header: "",
        msg: "",
        callBack: null
    })
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [bottomSheetAction, setbottomSheetAction] = React.useState(null)


    const paystackWebViewRef = React.useRef();
    const paymentOptions = {
        card: true, // Enable card payments
        bank: true, // Disable bank payments
        ussd: true, // Enable USSD payments
        qr: true, // Disable QR code payments
        mobileMoney: true, // Enable mobile money payments
        email: true, // Disable email payments
        // Add any other payment types as needed
    };


    const handleDeleteAccount = (txn) => {
        setLoading(true)
        TopUpService({
            amount, user: data.User.id, data: txn, merchant: data.data.id
        })
            .then(response => {

                if (response.success == false) {
                    setLoading(false)
                    setmodalData({
                        isTrue: true,
                        header: "Error",
                        msg: response.message,
                        callBack: null,
                        buttonText: "Done"
                    })
                } else {
                    setmodalData({
                        isTrue: true,
                        header: "Successful",
                        msg: response.message,
                        callBack: () => {
                            login({
                                ...data.User,
                                ...response.data
                            })
                            navigation.pop()
                            setAmount("")
                        },
                        buttonText: "Done"
                    })
                    setLoading(false)
                }

            })
            .catch(error => {
                console.log(error)
                setmodalData({
                    isTrue: true,
                    header: "Error",
                    msg: "An error occured",
                    callBack: null,
                    buttonText: "Done"
                })
                setLoading(false)
            })
    }


    return (
        <>
            {console.log(data.User.id)}
            <SafeAreaView style={{
                backgroundColor: "#fff", flex: 1
            }} >
                <View style={{
                    // flex: 1
                }}>
                    <Paystack
                        paymentOptions={paymentOptions}
                        // paystackKey={paystackKey && paystackKey}
                        paystackKey="pk_test_0ae598740dd4cbdfc0b09614de18230643765609"
                        billingEmail={data.User.email}
                        amount={amount}
                        onCancel={(e) => {
                            // handle response here
                        }}
                        onSuccess={(res) => {
                            console.log("Success")
                            handleDeleteAccount(res)
                        }}
                        ref={paystackWebViewRef}
                    />
                </View>

                <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                    <BackIcon />
                    <Text fontSize="lg" fontWeight="bold">{data.name} Top-up</Text>
                </HStack>

                <ScrollView >
                    <VStack space={4}>
                        <VStack bg="white" shadow={0.1} marginVertical={0}>

                            <HStack p={3} justifyContent="center" alignItems="center" >

                                <Input
                                    onChange={(value) => {
                                        setAmount(value.nativeEvent.text)
                                    }}
                                    keyboardType='numeric'
                                    value={amount}
                                    style={{ textAlign: "center", fontSize: 30, }}
                                    w={{ md: "95%" }}
                                    height={70}
                                    flex={5}
                                    rounded={10}
                                    justifyContent="center"
                                    placeholder=' ₦1000'
                                    // InputLeftElement={<SearchAlt />}
                                    size={25} color="red.400" />
                            </HStack>

                            <Stack mb={10} p={4} >
                                {/* Promotions */}
                                <Box>
                                    <HStack alignItems="center" >
                                        <CheckCircleIcon size={23} style={{ color: Colors.dark }} />
                                        <VStack ml={2} >
                                            <Text fontWeight="bold">Instant access</Text>
                                            <Text color="gray.500">Invite friends and earn up to ₦4,200 Cash</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack alignItems="center" mt={5}>
                                        <CheckCircleIcon size={23} style={{ color: Colors.dark }} />
                                        <VStack ml={2} >
                                            <Text fontWeight="bold">Safe and Reliable</Text>
                                            <Text color="gray.500">Invite friends and earn up to ₦4,200 Cash</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack alignItems="center" mt={5} >
                                        <CheckCircleIcon size={23} style={{ color: Colors.dark }} />
                                        <VStack ml={2} >
                                            <Text fontWeight="bold">Online and Offline Merchants acceptance</Text>
                                            <Text color="gray.500">Invite friends and earn up to ₦4,200 Cash</Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </Stack>


                        </VStack>

                    </VStack>
                </ScrollView>

            </SafeAreaView>

            <Stack p={8} bgColor="#fff" >
                <CustomButtons callBack={() => {
                    Keyboard.dismiss()
                    paystackWebViewRef.current.startTransaction()
                }}
                    primary Loading={false}
                    LoadingText="Please wait..."
                    width="100%" height={58} text="Top-up with Paystack" />
            </Stack>




            <Actionsheet isOpen={bottomSheet} onClose={() => {
                setbottomSheet(!bottomSheet)
            }}>
                <Actionsheet.Content>

                    {bottomSheetAction == "PAYMENT TYPE" && <>
                        <BoldText text="Select top-up options" color={Colors.dark} style={{ marginTop: 10 }} />
                        <Stack mt={5} mb={10} style={{
                            width: "100%",
                            padding: 15
                        }} >
                            <TouchableOpacity   >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4}>
                                        {/* <DeleteIcon /> */}
                                        <VStack>
                                            <BoldText1 text="Top-up with Paystack" color={Colors.dark} />
                                            <BoldText text="This payment method id secured with Paystack" color="mediumseagreen" style={{ opacity: 0.7 }} />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>
                            <Divider marginVertical={16} bgColor="gray.200" />
                            <TouchableOpacity onPress={() => {
                                // disp_Login(null)
                                // navigation.replace('Login')
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4}>
                                        {/* <DeleteIcon /> */}
                                        <VStack>
                                            <BoldText1 text="Remove merchant" color={Colors.dark} />
                                            <BoldText text="You will loose all your token" color={Colors.primary}
                                                style={{ opacity: 0.5 }} />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>
                        </Stack>
                    </>}

                </Actionsheet.Content>
            </Actionsheet>


            <ModalPop open={modalData.isTrue}>
                <HStack space={3} style={{
                    borderRadius: 18,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginTop: 40,
                }} >

                    <VStack flex={2} space={3} >
                        <BoldText2 color={modalData.type == "ERROR" ? Colors.primary : "green"} text={modalData.header} />
                        <Text>
                            {modalData.msg}
                        </Text>
                        <HStack alignItems="center" mt={5} space={5} >
                            <Button bg={Colors.white} size="sm" variant="outline" style={{
                                width: 120,
                                backgroundColor: "#000",
                                height: 50
                            }}
                                onPress={() => {
                                    setmodalData({
                                        ...modalData,
                                        isTrue: false
                                    })
                                    modalData.callBack()
                                }}
                                colorScheme={Colors.primary} borderRadius="full">

                                <HStack justifyContent="space-around" alignItems="center" space={3} >
                                    <Text style={{ color: "#fff" }} fontSize="xs">{modalData.buttonText}</Text>
                                </HStack>
                            </Button>

                        </HStack>
                    </VStack>
                </HStack>

            </ModalPop>

            <Loader loading={loading} />
        </>
    );
}




export default Topup;