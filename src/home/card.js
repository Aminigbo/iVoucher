import React, { useState } from 'react';
import { Text, VStack, HStack, Icon, Stack, Divider, AddIcon, Center, FlatList, Actionsheet, SmallCloseIcon, Select, CheckIcon } from 'native-base';
import { RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { ArrowForward } from '../global-components/icons';
import { CardComponent } from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, NumberWithCommas } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons, LinkButtons } from '../global-components/buttons';
import { Activity, ArrowBigDown, ArrowBigUp, ChartPie, Copy, CreditCard, Delete, DollarSign, Download, Globe, Menu, Minus, PlusIcon, Shuffle, Snowflake } from 'lucide-react-native';

import { FundCardController, GetCardDetailsController, WithdrawCardController } from '../auth/controllers';


const Colors = Color()

function Card({ navigation, }) {
    const [loadingText, setloadingText] = React.useState("")
    const [bottomSheetType, setbottomSheetType] = React.useState("")
    const [topupAmount, settopupAmount] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const [claimCard, setclaimCard] = useState(false)
    const [conversionRate, setconversionRate] = useState(null)
    const [CardInfo, setCardInfo] = useState(null)


    const [fundingSource, setFundingSource] = React.useState()

    let { User, login, Transactions, GetCardDetails, GetAllTransactions } = appState()




    function GetCardDetailsHandler() {
        User.card && GetCardDetailsController(setLoading, User.card.reference, setCardInfo);
    }



    function WithdrawCardHandler() {
        setLoading(true)
        WithdrawCardController(setLoading, setloadingText, User, topupAmount, CardInfo.reference, GetCardDetailsHandler, login)
    }

    function FundCardHandler() {
        setLoading(true)
        FundCardController(setLoading, setloadingText, topupAmount, topupAmount * conversionRate.rate, CardInfo.reference, GetCardDetailsHandler, User.id, fundingSource)
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            User.card && GetCardDetailsHandler();
            // GetAllTransactions()
        });

        return unsubscribe;

    }, [navigation]);




    return !User ? navigation.replace("Login") : (
        // return (
        <>
            {console.log(User.card)}

            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
            }} >

                <HStack alignItems="center" justifyContent="space-between" paddingVertical={18} pt={6} pb={4} p={2} >
                    <Text fontSize="xl" fontWeight="bold">USD Virtual Card</Text>
                </HStack>


                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <VStack space={4} >
                                <CardComponent
                                    User={User}
                                    CardInfo={CardInfo}
                                    setCardInfo={setCardInfo}
                                    setclaimCard={setclaimCard}
                                    setbottomSheetType={setbottomSheetType}
                                    GetCardDetails={GetCardDetails}
                                />
                                {/* Quick Action Buttons */}
                                <VStack bg="white" shadow={0.1}>

                                    {User.accountHolderReference ?
                                        <>
                                            {User.card && <>
                                                <Center style={{ marginVertical: 15 }} >
                                                    <Text fontSize={12}
                                                        fontWeight="light"
                                                        color="grey"
                                                    >
                                                        USD balance
                                                    </Text>
                                                    <Text fontSize={20}
                                                        color={Colors.dark}
                                                        fontWeight="bold">
                                                        {User.UsdBal ? `USD ${NumberWithCommas(User.UsdBal)}.00` : "USD 0.00"}
                                                    </Text>

                                                </Center>
                                            </>}

                                            <HStack bg="white" space={20} alignItems="center" justifyContent="center"
                                                style={{
                                                    marginVertical: 15,
                                                    opacity: CardInfo ? 1 : 0.2
                                                }}>
                                                <TouchableOpacity onPress={() => {
                                                    // setclaimCard(true)
                                                    // setbottomSheetType("CARD-TOPUP")
                                                    // ConversionRate(2, setconversionRate, setclaimCard, setbottomSheetType, "CARD-TOPUP")

                                                    // getConversionRateHandler("CARD-TOPUP")

                                                    navigation.navigate("Card-topup")
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
                                                    navigation.navigate("Card-withdrawal")
                                                }} >
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            backgroundColor: Colors.accent,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<Download size={20} strokeWidth={2} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Withdraw</Text>
                                                    </VStack>
                                                </TouchableOpacity>

                                                {/* <TouchableOpacity onPress={() => {
                                                    // setclaimCard(true)
                                                    // setbottomSheetType("CARD-WITHDRAWAL")
                                                    navigation.navigate("Convert")
                                                }} >
                                                    <VStack alignItems="center" space={2}>
                                                        <Center style={{
                                                            borderWidth: 0,
                                                            borderRadius: 50,
                                                            backgroundColor: Colors.accent,
                                                            width: 40,
                                                            height: 40
                                                        }} >
                                                            <Icon as={<Shuffle size={20} strokeWidth={2} />} color={Colors.primary} />
                                                        </Center>
                                                        <Text fontSize="sm" light>Convert</Text>
                                                    </VStack>
                                                </TouchableOpacity> */}

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
                                                            <Icon as={<Menu size={20} strokeWidth={2} />} color={Colors.primary} />
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
                                                {Transactions && Transactions.filter(e => e.type == "CARD").length > 0 && <BoldText text="Transactions" color="#000" />}

                                                {Transactions && Transactions.filter(e => e.type == "CARD").length > 5 &&
                                                    <TouchableOpacity onPress={() => navigation.navigate("Notifications")} >
                                                        <HStack justifyContent="flex-end" alignItems="center" space={4} >
                                                            <Text fontWeight={500} color={Colors.primary} >See All</Text>
                                                            <ArrowForward color={Colors.primary} />
                                                        </HStack>
                                                    </TouchableOpacity>
                                                }
                                            </HStack>

                                            {Transactions && Transactions.filter(e => e.type == "CARD").slice(0, 3).map((items, index) => {
                                                return <TouchableOpacity
                                                    onPress={() => {
                                                        // console.log(items)
                                                        navigation.navigate("view-transaction", { data: items })
                                                    }}
                                                >
                                                    <HStack key={index} alignItems="center" space={3} style={{
                                                        marginTop: 20
                                                    }} >

                                                        <Center style={{
                                                            borderRadius: 30,
                                                            backgroundColor: items.flow == "IN" ? "#EAFBF5" : "#F9F1F1",
                                                            width: 30,
                                                            height: 30,
                                                        }} >

                                                            {items.flow == "IN" ?
                                                                <Icon as={<ArrowBigDown size={19} />} color={Colors.primary} /> :
                                                                <Icon as={<ArrowBigUp size={19} />} color={Colors.primary} />
                                                            }
                                                        </Center>
                                                        <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                            <VStack  >
                                                                {/* {console.log(items)} */}
                                                                <Text>{items.data.description}</Text>
                                                                <Text fontWeight="light" fontSize="xs" >{formatDate(items.created_at)}</Text>
                                                            </VStack>

                                                            <HStack alignItems="center" space={0.3} >
                                                                {items.flow == "IN" ?

                                                                    <Icon as={<PlusIcon size={13} />} color="mediumseagreen" />
                                                                    :
                                                                    <Icon as={<Minus size={11} />} color="crimson" />
                                                                }
                                                                <Text style={{
                                                                    paddingHorizontal: 5,
                                                                    paddingVertical: 1,
                                                                    // this is the end
                                                                    borderRadius: 6,
                                                                    fontSize: 13,
                                                                }} >${NumberWithCommas(items.amount)}</Text>
                                                            </HStack>
                                                        </HStack>
                                                    </HStack>

                                                </TouchableOpacity>

                                            })}

                                            {Transactions && Transactions.length < 1 &&
                                                <Center style={{
                                                    // backgroundColor:"red",
                                                    flex: 1,
                                                    padding: 20,
                                                    marginTop: 40
                                                }} >
                                                    <BoldText text="No transaction record" color="#000" />
                                                </Center>}

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
                                                            $2.00 non-refundable card creation fee
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
                                                    // setbottomSheetType("Claim")
                                                    // setclaimCard(true)
                                                    navigation.navigate("Complete-verification")
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
                        <RefreshControl refreshing={loading} onRefresh={() => {
                            // User.card && GetCardDetails(setCardInfo)
                            GetCardDetailsHandler()
                            // GetAllTransactions()
                        }} />
                    }
                />


                {User.accountHolderReference && <>

                    {!User.card &&
                        <Center>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("Claim-card")
                                    // ConversionRate(5, setconversionRate, setclaimCard, setbottomSheetType, 'Rate')
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
                </>

                }

            </SafeAreaView>



            <Actionsheet isOpen={claimCard} onClose={() => {
                setclaimCard(false)
                // claimCard
            }}>
                <Actionsheet.Content>

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
                                    {User.card.holder_name} 
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
                                    {User.card.first_six}{User.card.last_four}
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
                            marginBottom: 3,
                            paddingHorizontal: 20
                        }}  >
                            <VStack>
                                <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{}} >
                                    CVV (Security code)
                                </Text>
                                <Text fontSize={17} fontWeight="bold" color={Colors.dark} style={{ marginTop: 5 }} >
                                    {/* {"User.card.cvv"} */}
                                    044
                                </Text>
                            </VStack>
                            <TouchableOpacity onPress={() => {
                                // Clipboard.setString(CardInfo.cvv)
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
                                    {User.card.expiry_month} / {User.card.expiry_year}
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


    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },

});
