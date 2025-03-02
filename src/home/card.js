import React, { useEffect, useState } from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, Image, Center, FlatList, Overlay, Actionsheet, CheckCircleIcon, Alert, SmallCloseIcon } from 'native-base';
import { Clipboard, Modal, PermissionsAndroid, Platform, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { AcceptanceIcon, ArrowForward, CopyIcon, EmptyRecord, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, RefeeralIcon, ScanIcon, SecureIcon, SendVoucherIcon, ScanQRIcon, VoucherIcon, CloseIcon, DeleteIcon, BiometricIcon } from '../global-components/icons';
import { CardComponent } from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, ImagePicker, NumberWithCommas } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons, LinkButtons } from '../global-components/buttons';
import { Activity, ArrowBigDown, ArrowBigUp, ArrowDownUp, BadgePlus, ChartPie, CheckCheck, CheckCircle, Copy, CreditCard, Delete, DollarSign, Download, Ellipsis, EyeIcon, Globe, IdCard, Landmark, Plus, PlusCircleIcon, Send, Share, Share2Icon, ShieldEllipsis, Snowflake, UploadCloud, UserCheck } from 'lucide-react-native';

const Colors = Color()

function Card({ navigation, disp_transactions, }) {
    const [loadAll, setloadAll] = React.useState(false)
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [bottomSheetType, setbottomSheetType] = React.useState("")
    const [Overlay, setOverlay] = React.useState(false)
    const [topupAmount, settopupAmount] = React.useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = React.useState({
        transactions: false,
        pin: false
    })

    const [PickedImage, setPickedImage] = React.useState({ status: false })
    const [claimCard, setclaimCard] = useState(false)
    const [conversionRate, setconversionRate] = useState(null)
    const [CardInfo, setCardInfo] = useState(null)

    // 
    const [dd, setDD] = React.useState("")
    const [mm, setMM] = React.useState("")
    const [yy, setYY] = React.useState("")
    const [nin, setNIN] = React.useState("")

    let { User, Loading, Transactions, CardWithdrawal, SaveTrxn, VerifyNIN, CreateCard, ConversionRate, loadingText, GetCardDetails, FundCard } = appState()


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
                    // Alert.alert("Permision Error", "You need to allow us access to your camera")
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            // navigation.replace("Login")
        }
    };


    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            GetCardDetails(setCardInfo)
        });

        return unsubscribe;

    }, [navigation]);



    return !User ? navigation.replace("Login") : (
        // return (
        <>
            {/* {console.log(User.UsdBal)} */}

            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
            }} >

                <HStack alignItems="center" justifyContent="space-between" paddingVertical={18} pt={6} pb={4} p={2} >
                    <Text fontSize="xl" fontWeight="bold">Pocket Voucher Card</Text>
                </HStack>


                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <VStack space={4} >
                                <CardComponent
                                    User={User}
                                    CardInfo={CardInfo}
                                />
                                {/* Quick Action Buttons */}
                                <VStack bg="white" shadow={0.1}>

                                    {User.accountHolderReference ?
                                        <>
                                            {User.card && <>
                                                <Center style={{ marginVertical: 15 }} >
                                                    <Text fontSize={14}
                                                        fontWeight="light"
                                                        color={Colors.dark}
                                                    >
                                                        Card balance
                                                    </Text>
                                                    <Text fontSize={24}
                                                        color={Colors.dark}
                                                        fontWeight="bold">
                                                        {CardInfo ? `USD ${NumberWithCommas(NumberWithCommas(CardInfo.balance))}.00` : "--.--"}
                                                    </Text>

                                                </Center>
                                            </>}

                                            <HStack bg="white" space={12} alignItems="center" justifyContent="center"
                                                style={{
                                                    marginVertical: 20,
                                                    opacity: CardInfo ? 1 : 0.2
                                                }}>
                                                <TouchableOpacity onPress={() => {
                                                    setclaimCard(true)
                                                    setbottomSheetType("CARD-TOPUP")
                                                    ConversionRate(2, setconversionRate, setclaimCard, null, "TOP-UP")
                                                }} >
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            borderColor: Colors.primary,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<Plus size={25} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Top up</Text>
                                                    </VStack>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => {
                                                    setclaimCard(true)
                                                    setbottomSheetType("CARD-WITHDRAWAL")
                                                    ConversionRate(2, setconversionRate, setclaimCard, null, "WITHDRAWAL")
                                                }} >
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            borderColor: Colors.primary,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<Download size={25} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Withdraw</Text>
                                                    </VStack>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => {
                                                    GetCardDetails(setCardInfo, setclaimCard, setbottomSheetType)
                                                    // setclaimCard(true)
                                                    // setbottomSheetType("SHOW-DETAILS")
                                                }}>
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            borderColor: Colors.primary,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<EyeIcon size={25} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Details</Text>
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
                                                            borderColor: Colors.primary,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<Ellipsis size={25} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>More</Text>
                                                    </VStack>

                                                </TouchableOpacity>
                                            </HStack>
                                        </>
                                        :
                                        <Stack p={15} >
                                            <Text fontSize="2xl"
                                                color={Colors.dark}
                                                fontWeight="semibold">
                                                Pocket Voucher Card
                                            </Text>
                                            <Text fontSize="lg"
                                                fontWeight="medium"
                                                color={Colors.dark}
                                            >
                                                We designed it for your Digital Lifestyle</Text>
                                        </Stack>
                                    }

                                    {User.accountHolderReference && <Divider style={{ opacity: 0.4, marginVertical: 10 }} />}

                                    {User.accountHolderReference ?
                                        <Stack p={5}>

                                            <HStack style={{
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: 10
                                            }} >
                                                {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT" || e.type == "PV-PAYOUT").length > 0 && <BoldText text="Transactions" color="#000" />}

                                                {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT" || e.type == "PV-PAYOUT").length > 5 &&
                                                    <TouchableOpacity onPress={() => navigation.navigate("Notifications")} >
                                                        <HStack justifyContent="flex-end" alignItems="center" space={4} >
                                                            <Text fontWeight={500} color={Colors.primary} >See All</Text>
                                                            <ArrowForward color={Colors.primary} />
                                                        </HStack>
                                                    </TouchableOpacity>
                                                }
                                            </HStack>

                                            {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT" || e.type == "PV-PAYOUT").slice(0, 3).map((items, index) => {
                                                return <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate("view-transaction", { data: items })
                                                    }}
                                                >
                                                    <HStack key={index} alignItems="center" space={3} style={{
                                                        marginVertical: 20
                                                    }} >

                                                        <Center style={{
                                                            borderRadius: 30,
                                                            backgroundColor: "#EAFBF5",
                                                            width: 30,
                                                            height: 30,
                                                        }} >
                                                            <Icon as={<ArrowBigUp size={19} />} color={Colors.primary} />
                                                        </Center>
                                                        <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                            <VStack  >
                                                                <Text>{items.message}</Text>
                                                                <Text fontWeight="light" fontSize="xs" >{formatDate(items.created_at)}</Text>
                                                            </VStack>

                                                            <VStack  >
                                                                <Text style={{
                                                                    paddingHorizontal: 5,
                                                                    paddingVertical: 1,
                                                                    borderRadius: 6,
                                                                    fontSize: 13,
                                                                }} >${NumberWithCommas(items.amount)}</Text>
                                                            </VStack>
                                                        </HStack>
                                                    </HStack>

                                                </TouchableOpacity>

                                            })}

                                        </Stack>
                                        :
                                        <Stack p={5} >

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
                                                            Shop Anywhere
                                                        </Text>

                                                        <Text fontWeight="light" fontSize={14}>
                                                            Use your Pocket Voucher card for all your online
                                                            purchases anywhere Visa and Master cards are accepted
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
                                                            No Overcharge
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
                                                            $3.00 non-refundable card creation fee
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </HStack>


                                            <Stack mt={10} >

                                                <LinkButtons text="Terms and Conditions"
                                                    callBack={() => { }}
                                                    Style={{
                                                        textAlign: "center",
                                                        marginVertical: 10,
                                                    }} />
                                                <CustomButtons callBack={() => {
                                                    setclaimCard(true)
                                                    setbottomSheet("Claim")
                                                }}
                                                    primary
                                                    Loading={false}
                                                    LoadingText="Creating your card"
                                                    width="100%" height={58} text="Claim USD card" />
                                            </Stack>

                                        </Stack>
                                    }

                                </VStack>
                            </VStack>
                        </>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={loadAll} onRefresh={() => {
                            GetCardDetails(setCardInfo)
                        }} />
                    }
                />


                {!User.card &&
                    <Center>
                        <Alert maxW="400" status="info" colorScheme="info" mb={10} style={{
                            backgroundColor: "#FAF7F7",
                            width: "90%"
                        }}>
                            <VStack space={2} flexShrink={1} w="100%">
                                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                    <HStack flexShrink={1} space={2} alignItems="center">
                                        <CheckCircle />
                                        <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                            You're all set to claim your card
                                        </Text>
                                    </HStack>
                                    {/* <IconButton variant="unstyled" _focus={{
                                    borderWidth: 0
                                }} icon={<CloseIcon size="3" />} _icon={{
                                    color: "coolGray.600"
                                }} /> */}
                                </HStack>
                                <Box pl="6" _text={{
                                    color: "coolGray.600"
                                }}>
                                    There is a $2 fee to create a virtual USD card and a minimum of $3 is required to fund your card.
                                </Box>
                            </VStack>
                        </Alert>
                        <TouchableOpacity
                            onPress={() => {
                                ConversionRate(5, setconversionRate, setclaimCard, setbottomSheetType)
                            }}
                            style={[{
                                width: "90%",
                                alignSelf: "center",
                                borderRadius: 10,
                                paddingVertical: 17,
                                alignItems: "center",
                                backgroundColor: Colors.dark,
                                marginBottom: 20
                            }]}>
                            <BoldText text="Claim card" color="#fff" />
                        </TouchableOpacity>
                    </Center>
                }




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


            <Actionsheet isOpen={claimCard} onClose={() => {
                setclaimCard(false)
                // claimCard
            }}>
                <Actionsheet.Content>

                    {bottomSheetType == "Rate" && <>

                        <VStack space={2} flexShrink={1} w="100%" p={5} >
                            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                <HStack flexShrink={1} space={2} alignItems="center">
                                    <CheckCircle />
                                    <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                        Holla!! We have best rate for you.
                                    </Text>
                                </HStack>
                            </HStack>

                            <HStack flexShrink={1} space={5} alignItems="center" mt={8}>
                                <ArrowDownUp color={Colors.primary} />
                                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                    $1 = {conversionRate && `${conversionRate.to_currency} ${conversionRate.rate}`}
                                </Text>
                            </HStack>

                            <HStack flexShrink={1} space={5} alignItems="center" mt={5}>
                                <DollarSign color={Colors.primary} />
                                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                    Creation fee: $2
                                </Text>
                            </HStack>

                            <HStack flexShrink={1} space={5} alignItems="center" mt={5}>
                                <CreditCard color={Colors.primary} />
                                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                    Min. card topup: $3
                                </Text>
                            </HStack>

                            <Divider my={7} />

                            <Center>
                                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                                    You will be charged $5 ≈ ₦{NumberWithCommas(conversionRate.rate * 5)}
                                </Text>
                            </Center>
                        </VStack>

                        <TouchableOpacity
                            onPress={() => {
                                setclaimCard(false)
                                setbottomSheetType("")
                                CreateCard(conversionRate.rate * 5)
                            }}
                            style={[{
                                width: "95%",
                                alignSelf: "center",
                                borderRadius: 10,
                                paddingVertical: 17,
                                alignItems: "center",
                                backgroundColor: Colors.dark,
                                marginVertical: 20
                            }]}>
                            <BoldText text="Activate card" color="#fff" />
                        </TouchableOpacity>
                    </>}

                    {bottomSheetType == "Claim" && <>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>
                            Complete your identity verification
                        </Text>
                        <View style={{ padding: 15, width: "100%" }}>
                            <BoldText text="Enter your NIN" color="#000" />
                            <TextInput style={styles.input} placeholder="00000000000" onChangeText={setNIN} keyboardType='numeric' />
                            <BoldText text="Your date of birth" color="#000" style={{ marginTop: 15 }} />

                            <HStack space={4} justifyContent="space-between" >
                                <TextInput style={[styles.input, { flex: 1 }]} placeholder="YYYY" keyboardType='numeric' onChangeText={setYY} />
                                <TextInput style={[styles.input, { flex: 1 }]} placeholder="MM" keyboardType='numeric' onChangeText={setMM} />
                                <TextInput style={[styles.input, { flex: 1 }]} placeholder="DD" keyboardType='numeric' onChangeText={setDD} />
                            </HStack>


                            <BoldText text="Upload a copy of your ID" color="#000" style={{ marginTop: 20 }} />
                            <TouchableOpacity
                                onPress={() => {
                                    ImagePicker({
                                        setPickedImage
                                    })
                                }}
                                style={{
                                    // backgroundColor: gender == "MALE" ? "grey" : "#fff",
                                    borderWidth: 0.4,
                                    borderColor: "grey",
                                    paddingVertical: 30,
                                    marginTop: 10,
                                    borderRadius: 10,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: "grey" }}>
                                    {PickedImage.status == true ? "File selected" : "Select file"}
                                </Text>
                                {PickedImage.status == true ?
                                    <CheckCircle color="green" size={40} /> : <UploadCloud size={40} />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setclaimCard(false)
                                    let data = {
                                        nin, yy, mm,
                                        dd, PickedImage
                                    }
                                    VerifyNIN(data, setclaimCard)
                                }}
                                style={[{
                                    marginTop: 80,
                                    borderRadius: 10,
                                    paddingVertical: 17,
                                    // width: 100,
                                    alignItems: "center",
                                    backgroundColor: Colors.dark,
                                }]}>
                                <BoldText text="Submit" color="#fff" />
                            </TouchableOpacity>

                        </View>
                    </>}

                    {bottomSheetType == "CARD-TOPUP" && <>

                        <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{
                            marginVertical: 25
                        }} >  Top up USD card </Text>

                        <View style={[{ padding: 15, width: "100%", }, styles.shadowBox]}>

                            <BoldText text={`Funding source`} color="#000" style={{}} />
                            <TextInput style={[styles.input, { fontSize: 17, fontWeight: 500, color: "#000" }]}
                                placeholder={`NGN Balance - NGN ${NumberWithCommas(User.wallet)}`}
                                editable={false}
                                placeholderTextColor='#000'
                            />
                            <Divider />

                            <BoldText text={`Amount`} color="#000" style={{ marginTop: 35, }} />
                            <HStack space={3} style={{
                                alignItems: "center",
                            }} >
                                <Text fontSize={17} fontWeight="normal" color={Colors.dark} >  USD </Text>
                                <TextInput style={[styles.input, { fontSize: 20, fontWeight: 300, color: "#000", width: "80%" }]}
                                    placeholder="0.00"
                                    onChangeText={settopupAmount}
                                    value={topupAmount}

                                    keyboardType='numeric'
                                />
                            </HStack>
                            <Divider />
                            <HStack justifyContent="space-between" >
                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{ marginTop: 20 }} >
                                    NGN  <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{ marginTop: 20 }} >
                                        {conversionRate && NumberWithCommas(Math.round(topupAmount * conversionRate.rate * 100) / 100)}
                                    </Text>
                                </Text>

                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{ marginTop: 20 }} >
                                    || Rate  <Text fontSize={15} fontWeight="medium" color={Colors.dark} style={{ marginTop: 20 }} >
                                        $1.00 = ₦
                                        {conversionRate && NumberWithCommas(conversionRate.rate)}
                                    </Text>
                                </Text>
                            </HStack>


                            <TouchableOpacity
                                onPress={() => {
                                    FundCard(topupAmount, topupAmount * conversionRate.rate, setCardInfo)
                                    setclaimCard(false)
                                    settopupAmount("")
                                }}
                                style={[{
                                    marginTop: 80,
                                    borderRadius: 10,
                                    paddingVertical: 17,
                                    // width: 100,
                                    alignItems: "center",
                                    backgroundColor: Colors.dark,
                                }]}>
                                <BoldText text="Top up" color="#fff" />
                            </TouchableOpacity>
                        </View>

                    </>}



                    {bottomSheetType == "CARD-WITHDRAWAL" && <>

                        <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{
                            marginVertical: 25,
                            textAlign: "left"
                        }} >Withdraw Funds </Text>

                        <View style={[{ padding: 15, width: "100%", }, styles.shadowBox]}>

                            <BoldText text="Please, note that the funds will be withdrawn to your USD account" color="#000" style={{}} />

                            {/* <Divider style={{marginVertical:30}} /> */}

                            <BoldText text={`Amount to withdraw`} color="grey" style={{ marginTop: 30 }} />
                            <HStack space={3} style={{
                                alignItems: "center",
                            }} >
                                <Text fontSize={17} fontWeight="normal" color={Colors.dark} >  USD </Text>
                                <TextInput style={[styles.input, { fontSize: 20, fontWeight: 300, color: "#000", width: "80%" }]}
                                    placeholder="0.00"
                                    onChangeText={settopupAmount}
                                    value={topupAmount}

                                    keyboardType='numeric'
                                />
                            </HStack>
                            <Divider />
                            <HStack justifyContent="space-between" >
                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{ marginTop: 20 }} >
                                    Bal:  <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{ marginTop: 20 }} >
                                        ${NumberWithCommas(CardInfo.balance)}.00
                                    </Text>
                                </Text>
                            </HStack>


                            <TouchableOpacity
                                onPress={() => {
                                    CardWithdrawal(topupAmount, CardInfo.reference, setCardInfo)
                                    setclaimCard(false)
                                    settopupAmount("")
                                }}
                                style={[{
                                    marginTop: 80,
                                    borderRadius: 10,
                                    paddingVertical: 17,
                                    // width: 100,
                                    alignItems: "center",
                                    backgroundColor: Colors.dark,
                                    opacity: topupAmount > CardInfo.balance ? 0.3 : 1
                                }]}>
                                <BoldText text="Withdraw funds" color="#fff" />
                            </TouchableOpacity>
                        </View>

                    </>}


                    {bottomSheetType == "MORE-OPTIONS" && <>
                        <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{
                            marginVertical: 25
                        }} > Card options </Text>

                        <TouchableOpacity style={{
                            paddingHorizontal: 10,
                            width: "90%",
                        }} >
                            <HStack space={5}  >
                                <Delete />
                                <VStack>
                                    <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{}} >
                                        Delete card
                                    </Text>
                                    <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{}} >
                                        When you delete your card, all available funds will be
                                        returned to your wallet.
                                    </Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>

                        <Divider style={{ marginVertical: 25 }} />

                        <TouchableOpacity style={{
                            paddingHorizontal: 10,
                            width: "90%",
                        }} >
                            <HStack space={5}  >
                                <Snowflake />
                                <VStack  >
                                    <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{}} >
                                        Freeze card
                                    </Text>
                                    <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{}} >
                                        All attempted transactions to a frozen card will be declined.
                                    </Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>

                        <Divider style={{ marginVertical: 25 }} />


                        <TouchableOpacity style={{
                            paddingHorizontal: 10,
                            width: "90%",
                        }} >
                            <HStack space={5}  >
                                <Activity />
                                <VStack >
                                    <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{}} >
                                        Card Limits
                                    </Text>
                                    <Text fontSize={13} fontWeight="normal" color={Colors.dark} style={{}} >
                                        View your card limits.
                                    </Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>


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
                            <VStack>
                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{}} >
                                    Card Name
                                </Text>
                                <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{ marginTop: 5 }} >
                                    {CardInfo.card_holder.first_name} {CardInfo.card_holder.last_name}
                                </Text>
                            </VStack>
                            <TouchableOpacity onPress={() => {
                                Clipboard.setString(`${CardInfo.card_holder.first_name} ${CardInfo.card_holder.last_name}`)
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
                                    {CardInfo.pan}
                                </Text>
                            </VStack>
                            <TouchableOpacity onPress={() => {
                                Clipboard.setString(CardInfo.pan)
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
                                    CVV (Security code)
                                </Text>
                                <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{ marginTop: 5 }} >
                                    {CardInfo.cvv}
                                </Text>
                            </VStack>
                            <TouchableOpacity onPress={() => {
                                Clipboard.setString(CardInfo.cvv)
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
                                    {CardInfo.expiry_month} / {CardInfo.expiry_year}
                                </Text>
                            </VStack>

                            <TouchableOpacity onPress={() => {
                                Clipboard.setString(`${CardInfo.expiry_month} / ${CardInfo.expiry_year}`)
                            }} >
                                <Copy />
                            </TouchableOpacity>
                        </HStack>

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
                        <ShieldEllipsis size={150} strokeWidth={0.8} color={Colors.primary} />

                        <BoldText
                            size={18}
                            color={Colors.dark}
                            style={{
                                textAlign: "center"
                            }}
                            text="Your 4-digit pin has been set successfully."
                        />

                        <Divider my={7} />

                        <HStack space={4} style={{
                            alignItems: "center",
                            paddingHorizontal: 10
                        }} >
                            <Center style={{
                                borderRadius: 30,
                                backgroundColor: "#FEF4EA",
                                width: 45,
                                height: 45,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center"
                            }} >
                                <ArrowBigUp size={25} />
                                <ArrowBigDown size={25} />
                            </Center>
                            <Text fontSize="lg" fontWeight="light" color={Colors.dark}>
                                Send and receive money with your account seamlessly
                            </Text>
                        </HStack>

                        <HStack space={4} style={{
                            alignItems: "center",
                            marginTop: 30,
                            paddingHorizontal: 10
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
                            <Text fontSize="lg" fontWeight="light" color={Colors.dark}>
                                Add a merchant, top, and make purchases from your merchant wallets directly.
                            </Text>
                        </HStack>


                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            setModalVisible(false);
                            requestNotificationPermission()
                        }} >
                            <Text style={styles.registerButtonText}>Okay</Text>
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

    input: { padding: 15, marginVertical: 10, borderColor: '#ddd', borderBottomWidth: 0, borderRadius: 5, width: "100%" },


    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },

});
