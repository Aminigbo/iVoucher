import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, VStack, HStack, Icon, Stack, Divider, AddIcon, Center, FlatList, Actionsheet, SmallCloseIcon, Select, CheckIcon } from 'native-base';
import { PermissionsAndroid, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { ArrowForward } from '../global-components/icons';
import { CardComponent } from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, NumberWithCommas } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons, LinkButtons } from '../global-components/buttons';
import { Activity, ArrowBigDown, ArrowBigUp, Bell, ChartPie, Check, CheckCircle, Copy, CreditCard, Delete, DollarSign, Download, Globe, LockIcon, Menu, Minus, PlusIcon, ScanQrCode, Share, Shuffle, Snowflake, XCircle } from 'lucide-react-native';

import { FundCardController, GetCardDetailsController, WithdrawCardController } from '../auth/controllers';
import { CreateMedicardController, FetchMedicardController } from './service';
import { FetchUserInfoService } from '../auth/service';
import Swiper from 'react-native-swiper';
import { CardIcon, ReferralCard } from '../assets/svgs';


const Colors = Color()

function Card({ navigation, }) {
    const [loadingText, setloadingText] = React.useState("")
    const [bottomSheetType, setbottomSheetType] = React.useState("")
    const [topupAmount, settopupAmount] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const [claimCard, setclaimCard] = useState(false)
    const [CardInfo, setCardInfo] = useState(null)

    let { User, login, Transactions, GetCardDetails } = appState()


    const fetchUserInfo = useCallback(() => {
        setLoading(true);

        FetchUserInfoService(User.uid)
            .then(response => {
                if (response) {
                    login({
                        ...response,
                        refreshToken: User.refreshToken,
                        accessToken: User.accessToken,
                    });
                    // console.log("Fetched user info")
                } else {
                    Alert.alert("Error", "An error occured");
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [User, login]);


    // request camera permission
    const requestCameraPermission = useCallback(async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Pocket Voucher',
                        message: 'Pocket Voucher needs access to your camera',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    navigation.navigate("Scan", { user: User });
                } else {
                    Alert.alert("Permission Error", "You need to allow us access to your camera");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }, [navigation, User]);

    // render header
    const renderHeader = useMemo(() => (
        <HStack alignItems="center" justifyContent="space-between" paddingVertical={18} pt={6} pb={4} p={2}>
            <HStack space={3} style={{ marginRight: 15, alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("Persona")}>
                    <VStack>
                        <Text fontSize="lg" fontWeight="normal">Welcome</Text>
                        <Text fontSize="lg" fontWeight="bold">{User && `${User.name}`}</Text>
                    </VStack>
                </TouchableOpacity>
            </HStack>

            <HStack space={12} style={{ marginRight: 15 }}>
                <TouchableOpacity onPress={requestCameraPermission}>
                    <ScanQrCode size={22} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                    <Bell size={22} color={Colors.primary} />
                </TouchableOpacity>
            </HStack>
        </HStack>
    ), [User, navigation, requestCameraPermission]);

    // fetch medicard
    const fetchMedicard = useCallback(async () => {
        setLoading(true)
        // console.log("User.medicard", User.medicard)
        FetchMedicardController(User.medicard, User.uid)
            .then(response => {
                if (response) {
                    setCardInfo(response.data.data)
                    // console.log("CardInfo", response.data.data)
                    // console.log(response)
                } else {
                    // console.log(response)
                    Alert.alert("Error", "An error occured");
                }
                setLoading(false)
            })
            .catch(error => {
                // console.log(error);
                setLoading(false)
            });
    }, [User, login]);

    // render referral banner
    const renderReferralBanner = useMemo(() => (
        <HStack space={5} style={styles.banner}>
            <VStack space={3} style={{ flex: 2, justifyContent: "flex-start", alignItems: "flex-start" }}>
                <BoldText
                    color={Colors.dark}
                    size={14}
                    text="Refer a friend to Medicard and earn as much as ₦2,000 as a reward!"
                />
            </VStack>
            <Center flex={1} style={{ marginTop: 20 }}>
                <ReferralCard />
            </Center>
        </HStack>
    ), []);

    // const renderCardPromo = useMemo(() => !User.card && (
    const renderCardPromo = useMemo(() => (
        <HStack space={5} style={styles.banner}>
            <VStack space={3} style={{ flex: 2, justifyContent: "flex-start", alignItems: "flex-start" }}>
                <BoldText
                    color={Colors.dark}
                    size={14}
                    text="You have access to your full medical record with your Medicard"
                />
                <LinkButtons
                    Style={styles.cardButton}
                    Color={Colors.white}
                    callBack={() => navigation.navigate("Medical-record")}
                    text="View Record"
                />
            </VStack>
            <Center flex={1} style={{ marginTop: 20 }}>
                <CardIcon size={70} strokeWidth={1} color={Colors.primary} />
            </Center>
        </HStack>
    ), [navigation]);





    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            fetchMedicard();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        fetchMedicard();
    }, [])


    // return !User ? navigation.replace("Login") : (
    return (
        <>
            {/* {console.log(CardInfo)} */}
            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
            }} >
                {renderHeader}

                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <VStack space={4} >
                                <CardComponent
                                    setCardInfo={setCardInfo}
                                    setclaimCard={setclaimCard}
                                    CardInfo={CardInfo}
                                    setbottomSheetType={setbottomSheetType}
                                    GetCardDetails={GetCardDetails}
                                    navigation={navigation}
                                />
                                {/* Quick Action Buttons */}
                                <VStack bg="white" shadow={0.1}>

                                    {User?.medicard && <Divider style={{ opacity: 0.4, marginTop: 10 }} />}

                                    {User?.medicard ?
                                        <>
                                            {User.medicard && <>
                                                <Center style={{ marginVertical: 15 }} >
                                                    <Text fontSize={12}
                                                        fontWeight="light"
                                                        color="grey"
                                                    >
                                                        Medicard balance
                                                    </Text>
                                                    <Text fontSize={20}
                                                        color={Colors.dark}
                                                        fontWeight="bold">
                                                        {CardInfo ? `₦ ${NumberWithCommas(CardInfo?.balance || 0)}.00` : "₦ 0.00"}
                                                    </Text>

                                                </Center>
                                            </>}

                                            <HStack bg="white" space={20} alignItems="center" justifyContent="center"
                                                style={{
                                                    marginVertical: 15,
                                                    opacity: User.medicard ? 1 : 0.2
                                                }}>
                                                <TouchableOpacity onPress={() => {

                                                    navigation.navigate("Card-topup", { CardInfo })
                                                }} >
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            backgroundColor: Colors.accent,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<CreditCard size={20} strokeWidth={2} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Top up</Text>
                                                    </VStack>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => {
                                                    // setclaimCard(true)
                                                    // setbottomSheetType("CARD-WITHDRAWAL")
                                                    navigation.navigate("Deactivate-card", { card_number: CardInfo.card_number })
                                                }} >
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            backgroundColor: Colors.accent,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<LockIcon size={20} strokeWidth={2} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Deactivate</Text>
                                                    </VStack>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => {
                                                    setclaimCard(true)
                                                    setbottomSheetType("MORE-OPTIONS")
                                                }}>
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            backgroundColor: Colors.accent,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<Activity size={20} strokeWidth={2} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Limits</Text>
                                                    </VStack>

                                                </TouchableOpacity>
                                            </HStack>
                                        </>
                                        :
                                        <Stack p={15} >
                                            <Text fontSize="2xl"
                                                color={Colors.dark}
                                                fontWeight="semibold">
                                                Medicard
                                            </Text>
                                            <Text fontSize="lg"
                                                fontWeight="medium"
                                                color={Colors.dark}
                                            >
                                                Designed for your Digital Medical Lifestyle</Text>
                                        </Stack>
                                    }
                                    {User?.medicard && <Divider style={{ opacity: 0.4, marginTop: 10 }} />}

                                    {User?.medicard ?
                                        <>
                                            <VStack bg="white" shadow={0.1}>
                                                {/* {renderQuickActions} */}
                                                {renderCardPromo} 
                                                <Swiper
                                                    style={styles.swiper}
                                                    loop={true}
                                                    autoplay={true}
                                                    bounces={true}
                                                    bouncesZoom={true}
                                                    autoplayTimeout={5}
                                                >
                                                    {renderReferralBanner}
                                                </Swiper>
                                            </VStack>
                                            <Stack p={5}>
                                            </Stack></>
                                        :

                                        <Stack px={5}>
                                            <HStack alignItems="center" space={3} style={{
                                                marginVertical: 10,
                                                alignItems: "flex-start"
                                            }} >
                                                <Icon as={<Globe size={30} />} color={Colors.dark} />

                                                <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                    <VStack  >
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="bold"
                                                            color={Colors.dark}
                                                        >
                                                            Access Anywhere
                                                        </Text>

                                                        <Text fontWeight="light" fontSize={14}>
                                                            Use your Medicard to share your medical history with any
                                                            healthcare provider verified by Healthstack, anytime, anywhere.
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </HStack>

                                            <HStack alignItems="center" space={3} style={{
                                                marginVertical: 20,
                                                alignItems: "flex-start"
                                            }} >
                                                <Icon as={<ChartPie size={30} />} color={Colors.dark} />

                                                <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                    <VStack  >
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="bold"
                                                            color={Colors.dark}
                                                        >
                                                            Controlled Access
                                                        </Text>

                                                        <Text fontWeight="light" fontSize={16}>
                                                            Your card sppending is limited to onlt the amount uploaded to your card
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </HStack>

                                            <HStack alignItems="center" space={3} style={{
                                                marginVertical: 20,
                                                alignItems: "flex-start"
                                            }} >
                                                <Icon as={<DollarSign size={30} />} color={Colors.dark} />

                                                <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                    <VStack  >
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="bold"
                                                            color={Colors.dark}
                                                        >
                                                            Card fee
                                                        </Text>

                                                        <Text fontWeight="light" fontSize={16}>
                                                            N1000 non-refundable card creation fee.
                                                            No extra hidden fees.
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </HStack>


                                            <Stack mt={4} >

                                                <LinkButtons text="Terms and Conditions"
                                                    callBack={() => {
                                                        navigation.navigate("terms")
                                                    }}
                                                    Style={{
                                                        textAlign: "center",
                                                        marginVertical: 10,
                                                    }} />
                                                <CustomButtons callBack={() => {
                                                    setbottomSheetType("Claim")
                                                    setclaimCard(true)
                                                    // navigation.navigate("Complete-verification")
                                                }}
                                                    primary
                                                    Loading={false}
                                                    LoadingText="Creating your Medicard"
                                                    width="100%" height={58} text="Claim Medicard" />
                                            </Stack>

                                        </Stack>
                                    }

                                </VStack>
                            </VStack>
                        </>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={() => {
                            fetchMedicard()
                            // fetchUserInfo()
                        }} />
                    }
                />
            </SafeAreaView>



            <Actionsheet isOpen={claimCard} onClose={() => {
                setclaimCard(false)
                // claimCard
            }}>
                <Actionsheet.Content>

                    {bottomSheetType == "Claim" && <>
                        <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{
                            marginVertical: 25
                        }} >Confirm Claim </Text>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Complete-verification")
                                setclaimCard(false)
                            }}
                            style={{
                                paddingHorizontal: 10,
                                width: "90%",
                            }} >
                            <HStack space={5}  >
                                <CheckCircle />
                                <VStack>
                                    <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{}} >
                                        Confirm Claim
                                    </Text>
                                    <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{}} >
                                        Are you sure you want to claim your Medicard?
                                    </Text>
                                    <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{}} >
                                        N1000 non-refundable card creation fee.
                                    </Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>

                        <Divider style={{ marginVertical: 25 }} />

                        <TouchableOpacity style={{
                            paddingHorizontal: 10,
                            width: "90%",
                            marginBottom: 20
                        }} >
                            <HStack space={5}  >
                                <XCircle />
                                <VStack  >
                                    <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{}} >
                                        Cancel
                                    </Text>
                                    <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{}} >
                                        Cancel the claim process.
                                    </Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>

                    </>}

                    {bottomSheetType == "MORE-OPTIONS" && <>
                        <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{
                            marginVertical: 25
                        }} > Card Limits</Text>


                        {/* <Activity /> */}
                        <VStack style={{
                            padding: 10,
                        }} >
                            <HStack style={{ marginTop: 10, justifyContent: "space-between", width: "90%", alignItems: "center" }} >
                                <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{ paddingRight: 10 }} >
                                    Daily Limit
                                </Text>
                                <Divider style={{ width: 30 }} />
                                <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{ paddingRight: 10 }} >
                                    N100,000
                                </Text>
                            </HStack>

                            <HStack style={{ marginTop: 10, justifyContent: "space-between", width: "90%", alignItems: "center" }} >
                                <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{ paddingRight: 10 }} >
                                    Weekly Limit
                                </Text>
                                <Divider style={{ width: 30 }} />
                                <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{ paddingRight: 10 }} >
                                    N500,000
                                </Text>
                            </HStack>

                            <HStack style={{ marginTop: 10, justifyContent: "space-between", width: "90%", alignItems: "center" }} >
                                <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{ paddingRight: 10 }} >
                                    Monthly Limit
                                </Text>
                                <Divider style={{ width: 30 }} />
                                <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{ paddingRight: 10 }} >
                                    N1,000,000
                                </Text>
                            </HStack>
                        </VStack>

                        <Divider style={{ marginVertical: 15 }} />

                        <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{ textAlign: "center", padding: 15 }} >
                            Your card has spending limits that help protect your account and ensure secure transactions.
                        </Text>

                    </>}

                    {bottomSheetType == "SHOW-DETAILS" && CardInfo && <>
                        <HStack style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            padding: 10,
                        }}>
                            <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{

                            }} > Card Details </Text>

                            <TouchableOpacity onPress={() => {
                                setclaimCard(false)
                                setbottomSheetType("")
                            }} >
                                <SmallCloseIcon />
                            </TouchableOpacity>

                        </HStack>
                        <Divider style={{ marginVertical: 25 }} />

                        <HStack style={{
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 10,
                            marginBottom: 3,
                            paddingHorizontal: 20
                        }}  >
                            {console.log(CardInfo)}
                            <VStack>
                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{}} >
                                    Card Name
                                </Text>
                                <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{ marginTop: 5 }} >
                                    {CardInfo.card_name}
                                </Text>
                            </VStack>
                            <TouchableOpacity onPress={() => {
                                // Clipboard.setString(`${CardInfo.card_holder.first_name} ${CardInfo.card_holder.last_name}`)
                            }} >
                                <Copy />
                            </TouchableOpacity>
                        </HStack>

                        <HStack style={{
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 10,
                            marginBottom: 3,
                            paddingHorizontal: 20
                        }}  >
                            <VStack>
                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{}} >
                                    Card Number
                                </Text>
                                <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{ marginTop: 5 }} >
                                    {CardInfo.card_number}
                                </Text>
                            </VStack>
                            <TouchableOpacity onPress={() => {
                                // Clipboard.setString(CardInfo.pan)
                            }} >
                                <Copy />
                            </TouchableOpacity>
                        </HStack>

                        <HStack style={{
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 10,
                            marginBottom: 10,
                            paddingHorizontal: 20
                        }}  >
                            <VStack>
                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{}} >
                                    Expiry Date
                                </Text>
                                <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{ marginTop: 5 }} >
                                    {CardInfo.expires_at}
                                </Text>
                            </VStack>

                            <TouchableOpacity onPress={() => {
                                // Clipboard.setString(`${CardInfo.expiry_month} / ${CardInfo.expiry_year}`)
                            }} >
                                <Copy />
                            </TouchableOpacity>
                        </HStack>

                    </>}

                </Actionsheet.Content>
            </Actionsheet>


            <Loader loading={loading}
            // text={loadingText} 
            />

        </>
    );
}




export default Card;


const styles = StyleSheet.create({

    input: {
        padding: 15,
        marginVertical: 10,
        borderColor: '#ddd', borderBottomWidth: 1, borderRadius: 5, width: "100%",
        color: "#000"
    },

    swiper: {
        height: 150,
    },
    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },

    banner: {
        height: 120,
        backgroundColor: Colors.accent,
        margin: 15,
        position: "relative",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15, 
    },
    cardButton: {
        backgroundColor: Colors.dark,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    voucherItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        alignItems: "center"
    },

});
