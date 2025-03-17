import React, { useEffect, useState } from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, Image, Center, FlatList, Overlay, Actionsheet, CheckCircleIcon, ArrowForwardIcon, Avatar } from 'native-base';
import { ActivityIndicator, Alert, AppState, Modal, PermissionsAndroid, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { AcceptanceIcon, ArrowForward, CopyIcon, EmptyRecord, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, RefeeralIcon, ScanIcon, SecureIcon, SendVoucherIcon, ScanQRIcon, VoucherIcon, CloseIcon, DeleteIcon, BiometricIcon } from '../global-components/icons';
import { VoucherComponent } from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Merchant } from '../utilities/data';
// import { Transactions_action, User } from '../redux';
import { connect } from 'react-redux';
import { CreatePinController, FetchTransactionsModel, GetAppConfigService } from './service';
import { formatDate, NumberWithCommas, timeAgo } from '../utilities';
import ShareLib from 'react-native-share';
import { FetchUserInfoService } from '../auth/service';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { LinkButtons } from '../global-components/buttons';
import { ArrowBigDown, ArrowBigUp, BadgePlus, CopyCheck, CreditCard, IdCard, Landmark, PlusCircleIcon, Send, Share, Share2Icon, ShieldEllipsis, Ticket, TicketCheck, TicketCheckIcon, UserCheck, Wallet } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';
import { CardIcon, ReferralCard } from '../assets/svgs';


const Colors = Color()

function Card({ navigation, disp_transactions, }) {


    const offset = useSharedValue(0);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
    }));

    const OFFSET = 40;
    const TIME = 250;

    const handlePress = () => {
        offset.value = withSequence(
            // start from -OFFSET
            withTiming(-OFFSET, { duration: TIME / 2 }),
            // shake between -OFFSET and OFFSET 5 times
            withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true),
            // go back to 0 at the end
            withTiming(0, { duration: TIME / 2 })
        );
    };



    const [inputs, setInputs] = useState(['', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false);

    const [seeBal, setseeBal] = React.useState(true)
    const [AppConfigs, setAppConfigs] = React.useState(null)
    const [loadAll, setloadAll] = React.useState(false)
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [bottomSheetType, setbottomSheetType] = React.useState("")
    const [Overlay, setOverlay] = React.useState(false)
    const [app_State, setApp_State] = useState(AppState.currentState);
    const [modalVisible, setModalVisible] = useState(false);
    const [SingleToken, setSingleToken] = React.useState(null)
    const [Vouchers, setVouchers] = useState([])
    const [loading, setLoading] = React.useState({
        transactions: false,
        pin: false
    })

    let { User, Transactions, login, SaveTrxn, VerifyKYC, handleFetchVoucher, handleDeactivateToken, Loading, loadingText } = appState()


    const requestNotificationPermission = async () => {
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Blake',
                        message:
                            'Blake needs access to ' +
                            'send you notification',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // navigation.navigate("Scan", { user: User.id })
                } else {
                    Alert.alert("Permision Error", "You need to allow us access to your camera")
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            // navigation.replace("Login")
        }
    };

    const handleFetchTransactions = () => {
        setLoading({
            ...loading,
            transactions: true
        })

        FetchTransactionsModel(User.id)
            .then(response => {
                setLoading({
                    ...loading,
                    transactions: false
                })

                if (response.success == false) {
                    SaveTrxn([])
                } else {
                    SaveTrxn(response.data)
                }

            })
            .catch(error => {
                disp_transactions([])
                setLoading({
                    ...loading,
                    transactions: false
                })
            })
    }


    const handleFetchAppConfig = () => {
        GetAppConfigService()
            .then(response => {

                if (response.success == false) {
                    setAppConfigs(null)
                } else {
                    setAppConfigs(response.data)
                }

            })
            .catch(error => {
                setAppConfigs(null)
            })
    }


    function FetchUserInfo() {
        FetchUserInfoService(User.id)
            .then(response => {
                if (response.success == false) {
                    Alert.alert("Error", response.message)
                } else {
                    // console.log(response.data)
                    login({
                        ...User,
                        ...response.data
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }


    // React.useEffect(() => {
    //     handleFetchTransactions()
    //     handleFetchAppConfig()
    //     FetchUserInfo()
    // }, [])


    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            handleFetchTransactions()
            handleFetchAppConfig()
            FetchUserInfo()
            handleFetchVoucher(setVouchers)

        });

        return unsubscribe;

    }, [navigation]);



    const totalAmount = User ? User.merchants.reduce((sum, item) => sum + item.bal, 0) : "";


    const onShareToken = async () => {
        if (!AppConfigs) {
            handleFetchAppConfig()
        } else {
            try {
                await ShareLib.open({
                    message: `Follow the link ${Platform.OS == "android" ? AppConfigs.playStoreLink : AppConfigs.appStoreLink} to download the Pocket Voucher app. Use my referral code ${"User.reffCode"} to register and win a free shoping voucher`,
                    url: `Follow the link ${Platform.OS == "android" ? AppConfigs.playStoreLink : AppConfigs.appStoreLink} to download the Pocket Voucher app. Use my referral code ${"User.reffCode"} to register and win a free shoping voucher`,
                });
            } catch (error) {

            }

        }

    };



    // useEffect(() => {
    //     const handleAppStateChange = (nextAppState) => {
    //         // If the app transitions from active to background, lock the app
    //         if (app_State.match(/active/) && nextAppState === 'background') {
    //             // show overlay
    //             // setOverlay(true)
    //             // navigation.reset({
    //             //     index: 0,
    //             //     routes: [{ name: 'Biometrics' }], // Redirect to Login screen
    //             // });

    //             console.log("app_State",app_State)
    //             console.log("next state ",nextAppState)
    //         }

    //         // Update the app state
    //         setApp_State(nextAppState);
    //     };

    //     // Add the listener for app state changes
    //     const subscription = AppState.addEventListener('change', handleAppStateChange);

    //     // Cleanup the listener when the component unmounts
    //     return () => {
    //         subscription.remove();
    //     };
    // }, [app_State, navigation]);


    const handleKeyPress = (key) => {
        if (key === 'Del') {
            setError(false)
            if (currentIndex > 0) {
                const updatedInputs = [...inputs];
                updatedInputs[currentIndex - 1] = '';
                setInputs(updatedInputs);
                setCurrentIndex(currentIndex - 1);
            }
        } else if (key === "Done") {
            const updatedInputs = [...inputs];
            let inputedPin = updatedInputs.join('');
            // console.log(inputedPin)
            ConfigSafePin(inputedPin)

        } else if (currentIndex < 4) {
            const updatedInputs = [...inputs];
            updatedInputs[currentIndex] = key;
            setInputs(updatedInputs);
            setCurrentIndex(currentIndex + 1);
        }
    };


    function ConfigSafePin(key) {
        setLoading({
            ...loading,
            pin: true
        })
        CreatePinController({ user: User.id, pin: key })
            .then(response => {
                setLoading({
                    ...loading,
                    pin: false
                })

                if (response.success == false) {
                    return console.log(error)
                }

                login({
                    ...response.data,
                    ...User,
                })
                setModalVisible(true)


            })
            .catch(error => {
                setLoading({
                    ...loading,
                    pin: false
                })
                console.log(error)
            })
    }


    return !User ? navigation.replace("Login") : (
        // return (
        <>
            {/* {console.log(Vouchers.length)} */}

            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
            }} >

                <HStack alignItems="center" justifyContent="space-between"
                    paddingVertical={18} pt={6} pb={4} p={2} >


                    <HStack space={3} style={{ marginRight: 15, alignItems: "center" }} >
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("Support", { user: User.id }) }}
                        // onPress={handlePress}
                        >
                            <Avatar size="md" />
                        </TouchableOpacity >

                        <VStack>
                            <Text fontSize="lg" fontWeight="normal">Welcome</Text>
                            <Text fontSize="lg" fontWeight="bold">{User && User.firstName}</Text>
                        </VStack>

                    </HStack>

                    <HStack space={12} style={{ marginRight: 15 }} >
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("Support", { user: User.id }) }}
                        // onPress={handlePress}
                        >
                            <HelpCenterIcon />
                        </TouchableOpacity >

                        <TouchableOpacity onPress={() => {
                            navigation.navigate("Notifications")
                        }}>
                            <NotificationIcon />
                        </TouchableOpacity>

                    </HStack>
                </HStack>


                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <VStack space={4} mt={4} >
                                <VoucherComponent
                                    User={User}
                                    seeBal={seeBal}
                                    setseeBal={setseeBal}
                                />

                                {/* <Animated.View style={[{
                                    width: 100,
                                    height: 100,
                                    margin: 50,
                                    borderRadius: 15,
                                    backgroundColor: '#b58df1',
                                }, style]} /> */}

                                {/* Quick Action Buttons */}
                                <VStack bg="white" shadow={0.1}>
                                    <HStack
                                        bg="white"
                                        alignItems="center" p={4}
                                        justifyContent="space-around"
                                    >

                                        <TouchableOpacity onPress={() => navigation.navigate("Voucher")} >
                                            <VStack alignItems="center" space={2}>
                                                <Center style={{
                                                    borderWidth: 0,
                                                    borderRadius: 50,
                                                    backgroundColor: Colors.accent,
                                                    width: 45,
                                                    height: 45
                                                }} >
                                                    <Icon as={<Ticket size={25} strokeWidth={1.6} />} color={Colors.primary} />
                                                </Center>
                                                <Text fontSize="sm" light>Voucher</Text>
                                            </VStack>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("Send-to-pv");
                                        }}>
                                            <VStack alignItems="center" space={2}>
                                                <Center style={{
                                                    borderWidth: 0,
                                                    borderRadius: 50,
                                                    backgroundColor: Colors.accent,
                                                    width: 45,
                                                    height: 45
                                                }} >
                                                    <Icon as={<Wallet size={25} strokeWidth={1.6} />} color={Colors.primary} />
                                                </Center>
                                                <Text fontSize="sm" light>To Pocket</Text>
                                            </VStack>

                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("Send-to-bank");
                                        }}>
                                            <VStack alignItems="center" space={2}>
                                                <Center style={{
                                                    borderWidth: 0,
                                                    borderRadius: 50,
                                                    backgroundColor: Colors.accent,
                                                    width: 45,
                                                    height: 45
                                                }} >
                                                    <Icon as={<Landmark size={25} strokeWidth={1.6} />} color={Colors.primary} />
                                                </Center>
                                                <Text fontSize="sm" light>To Bank</Text>
                                            </VStack>

                                        </TouchableOpacity>

                                        {/* <TouchableOpacity onPress={() => {
                                            navigation.navigate("Cards")

                                        }} >
                                            <VStack alignItems="center" space={2}>
                                                <Center style={{
                                                    borderWidth: 0,
                                                    borderRadius: 50,
                                                    // borderColor: Colors.primary,
                                                    width: 40,
                                                    height: 40
                                                }} >
                                                    <Icon as={<CreditCard size={25} strokeWidth={1} />} color={Colors.primary} />
                                                </Center>
                                                <Text fontSize="sm" light>Card</Text>
                                            </VStack>
                                        </TouchableOpacity> */}
                                    </HStack>

                                    <HStack
                                        space={5}
                                        style={{
                                            height: 120,
                                            backgroundColor: Colors.accent,
                                            // backgroundColor: "#E6E6E6",
                                            margin: 15,
                                            position: "relative",
                                            borderRadius: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: 15,
                                            marginTop: 20,
                                            // opacity: 0.3, 
                                        }} >
                                        <VStack
                                            space={3}
                                            style={{
                                                flex: 2,
                                                justifyContent: "flex-start",
                                                alignItems: "flex-start",
                                            }}>
                                            <BoldText
                                                color={Colors.dark}
                                                size={14}
                                                text="Refer a friend to Pocket Voucher and earn a 2% voucher token as a reward!"
                                            />
                                            <LinkButtons
                                                Style={{
                                                    backgroundColor: Colors.dark,
                                                    borderRadius: 5,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                }}
                                                Color={Colors.white}
                                                callBack={onShareToken}
                                                text="Refeer" />
                                        </VStack>

                                        <Center flex={1} style={{ marginTop: 20 }} >
                                            <ReferralCard />
                                        </Center>
                                    </HStack>


                                    {!User.card &&
                                        <HStack
                                            space={5}
                                            style={{
                                                height: 120,
                                                backgroundColor: Colors.accent,
                                                margin: 15,
                                                position: "relative",
                                                borderRadius: 10,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: 15,
                                            }} >
                                            <VStack
                                                space={3}
                                                style={{
                                                    flex: 2,
                                                    justifyContent: "flex-start",
                                                    alignItems: "flex-start",
                                                }}>
                                                <BoldText
                                                    color={Colors.dark}
                                                    size={14}
                                                    text="Claim your first Pocket Voucher virtual USD card"
                                                />
                                                <LinkButtons
                                                    Style={{
                                                        backgroundColor: Colors.dark,
                                                        borderRadius: 5,
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,
                                                    }}
                                                    Color={Colors.white}
                                                    callBack={onShareToken}
                                                    text="Create" />
                                            </VStack>

                                            <Center flex={1} style={{ marginTop: 20 }} >
                                                <CardIcon size={70} strokeWidth={1} color={Colors.primary} />
                                            </Center>
                                        </HStack>
                                    }

                                    {Vouchers.length > 0 && <>

                                        <HStack justifyContent="space-between" alignItems="center" p={2} mb={-2} style={{ paddingLeft: 20, marginTop: 20 }} >
                                            <BoldText text="Active vouchers" color="#000" />
                                            {Vouchers && Vouchers.length > 3 &&
                                                <TouchableOpacity onPress={() => {
                                                    navigation.navigate("Voucher")
                                                }} >
                                                    <HStack justifyContent="flex-end" alignItems="center" space={4} >
                                                        <Text fontWeight={500} color={Colors.primary} >See All</Text>
                                                        <ArrowForward color={Colors.primary} />
                                                    </HStack>
                                                </TouchableOpacity>
                                            }
                                        </HStack>

                                        <Stack p={2} mx={4} shadow={0.5} >
                                            <Box mb={11} >
                                                {

                                                    Vouchers.slice(0, 3).map((items, index) => {
                                                        return <HStack alignItems="center" mt={6} space={2} >
                                                            <TouchableOpacity
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    justifyContent: "space-between",
                                                                    flex: 1,
                                                                    alignItems: "center"
                                                                }}
                                                                onPress={() => {
                                                                    setbottomSheetType("REVERSE TOKEN")
                                                                    setSingleToken(items)
                                                                    setbottomSheet(true)
                                                                }} >
                                                                <HStack space={3} >
                                                                    <TicketCheckIcon color={items.resolved == false ? "mediumseagreen" : "crimson"} />
                                                                    <VStack >
                                                                        <HStack>
                                                                            <Text fontWeight="medium" color={Colors.primary} >{items.token} </Text>
                                                                        </HStack>
                                                                        <Text fontWeight="light" >₦{NumberWithCommas(items.amount)} {items.remark && items.remark.slice(0, 15)}{items.remark.length > 15 && "..."}</Text>
                                                                    </VStack>
                                                                </HStack>
                                                                <Text fontWeight="light" >{timeAgo(items.created_at)}</Text>
                                                                {/* <ArrowForward /> */}

                                                            </TouchableOpacity>
                                                        </HStack>

                                                    })
                                                }
                                            </Box>
                                        </Stack>  *
                                    </>}


                                    {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT" || e.type == "PV-PAYOUT").length > 0 && <Divider style={{ opacity: 0.4, marginVertical: 20 }} />}

                                    <Stack p={5}  >

                                        <HStack style={{
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 10
                                        }} >
                                            {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT" || e.type == "PV-PAYOUT").length > 0 && <BoldText text="Recent activities" color="#000" />}

                                            {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT" || e.type == "PV-PAYOUT").length > 2 &&
                                                <TouchableOpacity onPress={() => navigation.navigate("Notifications")} >
                                                    <HStack justifyContent="flex-end" alignItems="center" space={4} >
                                                        <Text fontWeight={500} color={Colors.primary} >See All</Text>
                                                        <ArrowForward color={Colors.primary} />
                                                    </HStack>
                                                </TouchableOpacity>
                                            }
                                        </HStack>



                                        {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT" || e.type == "PV-PAYOUT").slice(0, 4).map((items, index) => {
                                            return <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate("view-transaction", { data: items })
                                                }}
                                            >
                                                <HStack key={index} mt={5} alignItems="center" space={3} >

                                                    {items.type == "BANK-PAYOUT" && <Center style={{
                                                        borderRadius: 30,
                                                        backgroundColor: "#FEF4EA",
                                                        width: 35,
                                                        height: 35
                                                    }} >
                                                        <Icon as={<ArrowBigUp size={19} />} color={Colors.primary} />
                                                    </Center>}
                                                    {items.type == "MERCHANT-TOPUP" && <Center style={{
                                                        borderRadius: 30,
                                                        backgroundColor: "#FEEAFD",
                                                        width: 30,
                                                        height: 30,
                                                    }} >
                                                        <Icon as={<PlusCircleIcon size={19} />} color={Colors.primary} />
                                                    </Center>}

                                                    {items.type == "PV-PAYOUT" && <Center style={{
                                                        borderRadius: 30,
                                                        backgroundColor: "#EAFBF5",
                                                        width: 30,
                                                        height: 30,
                                                    }} >
                                                        <Icon as={<ArrowBigUp size={19} />} color={Colors.primary} />
                                                    </Center>}


                                                    <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                        <VStack  >
                                                            <Text>{items.message}</Text>
                                                            <Text fontWeight="light" fontSize="xs" >{formatDate(items.created_at)}</Text>
                                                        </VStack>

                                                        <VStack  >
                                                            <Text style={{
                                                                color: items.status == "processing" ? "#E0B77E" : items.status == "success" ? "#7EE0B9" : "#E07E80",
                                                                paddingHorizontal: 5,
                                                                paddingVertical: 1,
                                                                borderRadius: 6,
                                                                fontSize: 13,
                                                            }} >{items.status}</Text>
                                                        </VStack>
                                                    </HStack>
                                                </HStack>

                                            </TouchableOpacity>

                                        })}

                                    </Stack>

                                </VStack>
                            </VStack>

                        </>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={loadAll} onRefresh={() => {
                            handleFetchAppConfig()
                            handleFetchTransactions()
                            FetchUserInfo()
                        }} />
                    }
                />

            </SafeAreaView>

            {Overlay && <Stack style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 100
            }} />}


            <Actionsheet isOpen={User.pin ? false : true} onClose={() => {
                // setbottomSheet(!bottomSheet)
            }}>
                <Actionsheet.Content>

                    {loading.pin && <Stack style={{
                        position: "absolute",
                        height: "110%",
                        width: "110%",
                        top: 0,
                        left: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        zIndex: 1
                    }} />}


                    <BoldText text="Create a secured pin" color={Colors.primary} style={{ padding: 10 }} />

                    {/* Input Boxes */}
                    <View style={styles.inputContainer}>
                        {inputs.map((input, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.inputBox,
                                    currentIndex === index && styles.activeInputBox,
                                    {
                                        borderColor: error && Colors.primary,
                                        backgroundColor: input ? '#000' : '#fff'
                                    }
                                ]}
                            >
                                {/* <Text style={styles.inputText}>{input ? '●' : ''}</Text> */}
                            </View>
                        ))}
                    </View>

                    {/* Custom Keyboard */}
                    <View style={styles.keysContainer}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Del', 0, 'Done'].map((key, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.keyButton,
                                    key === 'Del' && styles.deleteKey,
                                ]}
                                onPress={() => handleKeyPress(key)}
                            >
                                <Text style={styles.keyText}>
                                    {key === 'Done' ? <>
                                        {loading.pin ? <ActivityIndicator /> : <CheckCircleIcon size={25} color={Colors.primary} />}
                                    </> : key === 'Del' ? "⌫" : key}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </Actionsheet.Content>
            </Actionsheet>


            {/* send money */}
            <Actionsheet isOpen={bottomSheet} onClose={() => {
                setbottomSheet(!bottomSheet)
            }}>
                <Actionsheet.Content>

                    {bottomSheetType == "REVERSE TOKEN" && SingleToken && <>
                        {/* {console.log(SingleToken)} */}
                        <BoldText text={SingleToken && SingleToken.token} color="lightgrey" style={{ marginTop: 10 }} />

                        <Stack mt={5} mb={10} style={{
                            width: "100%",
                            padding: 15
                        }} >

                            <TouchableOpacity onPress={() => { Clipboard.setString(SingleToken.token) }} >
                                <HStack space={3} mb={5} >
                                    <CopyCheck color={Colors.primary} />
                                    <VStack >
                                        <HStack justifyContent="space-between" width="95%">
                                            <Text fontWeight="medium" fontSize={18} color={Colors.primary} >{SingleToken.token} </Text>
                                            <Text fontWeight="bold" fontSize={18} >₦{NumberWithCommas(SingleToken.amount)}</Text>
                                        </HStack>

                                    </VStack>
                                </HStack>
                            </TouchableOpacity>
                            {SingleToken.remark &&
                                <Text fontWeight="light" style={{ margin: 10 }} >{SingleToken.remark}</Text>
                            }

                            <Text fontWeight="light" style={{ margin: 10 }} >{timeAgo(SingleToken.created_at)}</Text>

                            <TouchableOpacity onPress={() => {
                                setbottomSheet(false)
                                handleDeactivateToken(SingleToken.token, setVouchers)
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" backgroundColor={Colors.dark} style={{
                                    padding: 10,
                                    borderRadius: 10,
                                    marginTop: 30
                                }} >
                                    <HStack space={4}>
                                        <DeleteIcon />
                                        <VStack>
                                            <BoldText1 text="Deactivate Token" color={Colors.white} />
                                            <BoldText
                                                style={{ marginTop: 5 }}
                                                text={`${NumberWithCommas(SingleToken.amount)} will be reversed to your wallet`} color="grey" />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>
                        </Stack>
                    </>}


                </Actionsheet.Content>
            </Actionsheet>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.overlay}>
                    <View style={styles.modalView}>
                        <ShieldEllipsis size={150} strokeWidth={1} color={Colors.primary} />

                        <BoldText
                            size={18}
                            color={Colors.dark}
                            style={{
                                textAlign: "center",
                                fontWeight: "bold"
                            }}
                            text="Your 4-digit pin has been set successfully."
                        />

                        <Divider my={7} />

                        <HStack space={4} style={{
                            alignItems: "center",
                            justifyContent: "space-between"
                        }} >
                            <Center style={{
                                borderRadius: 30,
                                backgroundColor: "#FEF4EA",
                                width: 45,
                                height: 45,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                            }} >
                                <ArrowBigUp size={20} />
                                <ArrowBigDown size={20} />
                            </Center>
                            <Text flex={1} fontSize="lg" fontWeight="normal" color={Colors.dark}>
                                Send and receive money with your account seamlessly
                            </Text>
                        </HStack>

                        <HStack space={4} style={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 30,
                        }} >
                            <Center style={{
                                borderRadius: 30,
                                backgroundColor: "#FEEAFD",
                                width: 45,
                                height: 45,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center"
                            }} >
                                <PlusCircleIcon size={25} color={Colors.primary} />
                            </Center>
                            <Text flex={1} fontSize="lg" fontWeight="normal" color={Colors.dark}>
                                Add a merchant, top, and make purchases from your merchant wallets directly.
                            </Text>
                        </HStack>


                        <TouchableOpacity
                            style={{
                                marginVertical: 30,
                            }}
                            onPress={() => {
                                setModalVisible(false);
                                requestNotificationPermission()
                            }} >
                            <Text style={{ color: Colors.primary }}>Okay</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <Loader loading={Loading} text={loadingText} />
        </>
    );
}




export default Card;


const styles = StyleSheet.create({

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 50
    },
    inputBox: {
        width: 15,
        height: 15,
        marginHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    activeInputBox: {
        borderColor: '#007BFF',
    },
    inputText: {
        fontSize: 24,
        color: '#000',
    },
    keysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    keyButton: {
        width: '30%',
        height: 90,
        // aspectRatio: 1,
        // padding: '2%',
        // backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 8,
        // borderWidth: 0.3,
        // borderColor: '#ddd',
    },
    deleteKey: {
        // backgroundColor: '#ffcccc',
    },
    keyText: {
        fontSize: 20,
        color: '#000',
    },
    sendButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },



    // =====

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: "85%",
        // height: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },

});
