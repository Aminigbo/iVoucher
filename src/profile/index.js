import React from "react";
import { Box, VStack, HStack, Text, Button, Icon, Pressable, Avatar, Divider, Badge, ArrowForwardIcon, QuestionIcon, Stack, Switch, Actionsheet, Center } from "native-base";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { History, CircleGauge, CreditCard, Wallet, ShieldCheck, Store, PartyPopper, Phone, Settings, Star, ChevronRight, Bolt, UserCheck, Landmark, User2, MessageCircleQuestion } from "lucide-react-native";
import { Color } from "../global-components/colors";

import { AcceptanceIcon, ArrowForward, Avater, BiometricIcon, CloseIcon, DeleteIcon, FastIcon, HeartIcon, LogoutIcon, MiniShareIcon, QRcodeIcon, SecureIcon, SmallAvater, SmallBiometricIcon } from '../global-components/icons';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { DeleteAccountService } from '../auth/service';
import { Loader } from '../global-components/loader';
import { appState } from '../state';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { ConfigBiometricController } from './service';
import ModalPop from '../global-components/modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleBiometricAuth } from '../helpers/biometrics';
import { DpUrl, NumberWithCommas } from "../utilities";



const Colors = Color()
const Profile = ({ navigation }) => {

    const { User, login, isBiometric, BiometricAuth, GetAllVirtualAccountTransactions } = appState()
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [bottomSheetType, setbottomSheetType] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [Key, setkey] = React.useState(null)
    const [biometricLoader, setbiometricLoader] = React.useState(false)

    const [modalData, setmodalData] = React.useState({
        isTrue: false,
        header: "",
        msg: "",
        callBack: null
    })


    const handleDeleteAccount = () => {
        setLoading(true)

        DeleteAccountService(User.id)
            .then(response => {

                if (response.success == false) {
                    setLoading(false)
                    Alert.alert("Error", response.message)
                } else {
                    login(null)
                    // Initialize(null)
                    navigation.replace('Login')
                }

            })
            .catch(error => {
                Alert.alert("Error", "An error occured")
                setLoading(false)
            })
    }


    const menuItems = [
        {
            title: "Personal Information", icon: User2, callBack: () => {
                navigation.navigate('Persona')
            }
        },
        {
            title: "Send money", icon: History, callBack: () => {
                setbottomSheet(!bottomSheet)
                setbottomSheetType("SEND-MONEY")
            }
        },
        {
            title: "Transactions", icon: Wallet, callBack: () => {
                navigation.navigate("Notifications")
            }
        },
        { title: "Virtual Card", icon: CreditCard, callBack: () => { navigation.navigate("Cards") } },
        {
            title: "Voucher", icon: Store, callBack: () => {
                navigation.navigate('Voucher')
            }
        },
    ];


    // return (
    return !User ? navigation.replace("Login") : (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView style={{}} >
                {/* Header Section */}
                {/* <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", marginRight: 20, marginTop: 10 }} >
                    <Icon as={Bolt} size={5} style={{ color: Colors.dark }} />
                </TouchableOpacity> */}

                {/* Balance Section */}
                <Box py={3} alignItems="center" mt={4}>
                    {/* <Text fontSize="xs" color="gray.500">Total Balance</Text> */}
                    <Avatar size="xl" source={{ uri: User.dp ? `${DpUrl}${User.dp}` : null }} />
                    <Box flexDirection="row" alignItems="center" mt={3}>
                        <Text fontSize="xl" medium ml={2}>{NumberWithCommas(User.firstName)} {NumberWithCommas(User.lastName)}</Text>
                    </Box>
                    {User.bankInfo &&
                        <Text fontSize="xs" color="gray.500" mt={1}>  {User.bankInfo.account_number} - {User.bankInfo.bank_name}</Text>
                    }
                </Box>

                {/* Menu Options */}
                <VStack mt={12} p={4} space={3} bg={Colors.accent} borderRadius={10} mx={4}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            onPressIn={() => { item.callBack() }}
                            style={{
                                marginBottom: 18
                            }} key={item.title} >
                            <HStack justifyContent="space-between" alignItems="center">
                                <HStack space={3} alignItems="center">
                                    <Icon as={item.icon} size={30} style={{ color: Colors.dark }} />
                                    <Text fontSize="sm" light>
                                        {item.title}
                                    </Text>
                                </HStack>
                                <ArrowForward />
                            </HStack>
                        </TouchableOpacity >
                    ))}
                </VStack>

                <Stack mt={9} p={15} style={{}} bg={Colors.accent} borderRadius={10} mx={4} mb={10} >
                    <TouchableOpacity onPress={() => {
                        handleBiometricAuth({
                            setbiometricLoader,
                            setkey,
                            Key,
                            isBiometric,
                            BiometricAuth,
                            message: isBiometric == false ? "Set Biometric auth" : "Disable Biometric auth",
                        })
                    }}  >
                        <HStack alignItems="center" justifyContent="space-between" >
                            <HStack space={4}>
                                <SmallBiometricIcon />
                                <BoldText text="Enrol Biometric" color={Colors.dark} />
                            </HStack>

                            {biometricLoader == true ?
                                <ActivityIndicator color={Colors.primary} /> :
                                <Switch
                                    isDisabled={true}
                                    size="sm"
                                    isChecked={isBiometric}
                                    colorScheme="primary"
                                />
                            }


                        </HStack>
                    </TouchableOpacity>

                    <Divider marginVertical={16} bgColor="gray.200" style={{ height: 0.4 }} />

                    <TouchableOpacity onPress={() => {
                        navigation.navigate("service-reset-pwd")
                    }}  >
                        <HStack alignItems="center" justifyContent="space-between" >
                            <HStack space={4}>
                                <ShieldCheck style={{ color: Colors.primary }} />
                                <BoldText text="Security Center" color={Colors.dark} />
                            </HStack>
                            <ArrowForward />
                        </HStack>
                    </TouchableOpacity>

                    <Divider marginVertical={16} bgColor="gray.200" style={{ height: 0.4 }} />

                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Support", { user: User.id })
                    }}  >
                        <HStack alignItems="center" justifyContent="space-between" >
                            <HStack space={4}>
                                <MessageCircleQuestion style={{ color: Colors.primary }} />
                                <BoldText text="Help Center" color={Colors.dark} />
                            </HStack>
                            <ArrowForward />
                        </HStack>
                    </TouchableOpacity>

                    <Divider marginVertical={16} bgColor="gray.200" style={{ height: 0.4 }} />

                    <TouchableOpacity onPress={() => {
                        // navigation.navigate("Support", { user: User.id })
                    }}  >
                        <HStack alignItems="center" justifyContent="space-between" >
                            <HStack space={4}>
                                <Star size={20} color={Colors.primary} />
                                <BoldText text="Rate Us" color={Colors.dark} />
                            </HStack>
                            <ArrowForward />
                        </HStack>
                    </TouchableOpacity>

                    {/* <Divider marginVertical={16} bgColor="gray.200" style={{ height: 0.4 }} /> */}

                    {/* <TouchableOpacity onPress={() => {
                        setbottomSheet(!bottomSheet)
                        setbottomSheetType("DEL-ACCOUNT")
                    }}  >
                        <HStack alignItems="center" justifyContent="space-between" >
                            <HStack space={4}>
                                <DeleteIcon />
                                <BoldText text="Delete account" color={Colors.dark} />
                            </HStack>
                            <ArrowForward />
                        </HStack>
                    </TouchableOpacity> */}

                </Stack>

            </ScrollView>



            <Loader loading={loading} />


            <Actionsheet isOpen={bottomSheet} onClose={() => {
                setbottomSheet(!bottomSheet)
            }}>
                <Actionsheet.Content>

                    {bottomSheetType == "SEND-MONEY" && <>
                        <BoldText1 text="Choose destination" color={Colors.dark} style={{ marginTop: 30, }} />
                        <HStack
                            space={4}
                            style={{
                                // height: 400,
                                padding: 20,
                                width: "100%",
                                // backgroundColor: "red",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 70
                            }} >
                            <VStack alignItems="flex-start" space={3} style={{
                                backgroundColor: Colors.accent,
                                borderRadius: 10,
                                height: 160,
                                padding: 20,
                                flex: 1
                            }} >
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("Send-to-pv");
                                    setbottomSheet(false)
                                }} >

                                    <HStack alignItems="center" space={1} mb={5}>
                                        <Center style={{
                                            borderRadius: 50,
                                            backgroundColor: Colors.dark,
                                            width: 25,
                                            height: 25
                                        }} >
                                            <Icon as={<UserCheck size={15} />} color={Colors.background} />
                                        </Center>
                                        <BoldText1 text="Pocket Voucher" size={11} color={Colors.dark} />
                                    </HStack>
                                    <Text style={{ fontWeight: 200, color: Colors.dark }} >Transfer to Pocket Voucher account</Text>

                                </TouchableOpacity>
                            </VStack>

                            <VStack alignItems="flex-start" space={3} style={{
                                backgroundColor: Colors.accent,
                                borderRadius: 10,
                                height: 160,
                                padding: 20,
                                flex: 1
                            }} >
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("Send-to-bank");
                                    setbottomSheet(false)
                                }} >
                                    <HStack alignItems="center" space={3} mb={5}>
                                        <Center style={{
                                            borderRadius: 50,
                                            backgroundColor: Colors.dark,
                                            width: 25,
                                            height: 25
                                        }} >
                                            <Icon as={<Landmark size={15} />} color={Colors.background} />
                                        </Center>
                                        <BoldText1 text="To Bank" size={11} color={Colors.dark} />
                                    </HStack>
                                    <Text style={{ fontWeight: 200, color: Colors.dark }} >Transfer to a bank account</Text>

                                </TouchableOpacity>
                            </VStack>
                        </HStack>

                    </>}

                    {bottomSheetType == "DEL-ACCOUNT" && <>

                        <BoldText text="Your account and all your records with us will be wiped." color={Colors.primary} style={{ marginTop: 10, padding: 20 }} />
                        <Stack mb={10} style={{
                            width: "100%",
                            padding: 15
                        }} >
                            <TouchableOpacity onPress={() => {
                                setbottomSheet(!bottomSheet)
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" backgroundColor={Colors.dark} style={{
                                    padding: 20,
                                    borderRadius: 10
                                }} >
                                    <HStack space={4}>
                                        <VStack>
                                            <BoldText1 text="Don't delete account" color={Colors.white} />
                                        </VStack>
                                    </HStack>
                                    <CloseIcon />
                                </HStack>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => {
                                setbottomSheet(!bottomSheet)
                                handleDeleteAccount()
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" style={{
                                    padding: 20,
                                    borderRadius: 10,
                                    marginTop: 40
                                }} >
                                    <HStack space={4}>
                                        <DeleteIcon />
                                        <VStack>
                                            <BoldText1 text="Delete account" color={Colors.primary} />
                                        </VStack>
                                    </HStack>
                                    <CloseIcon />
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
                                backgroundColor: Colors.lightGray,
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
                                    <Text style={{ color: "green" }} fontSize="xs">{modalData.buttonText}</Text>
                                </HStack>
                            </Button>

                        </HStack>
                    </VStack>
                </HStack>
            </ModalPop>


        </SafeAreaView>
    );
};

export default Profile;
