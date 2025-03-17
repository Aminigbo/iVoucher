import React, { useState } from "react";
import { Box, VStack, Text, Input, Button, HStack, Image, Pressable, ScrollView, Divider, Select, CheckIcon, Center, Icon, Actionsheet, Stack } from "native-base";
import { FlatList, Keyboard, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft, Landmark, Wifi } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowForward, BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { appState } from "../state";
import { BoldText, BoldText1, BoldText2 } from "../global-components/texts";
import { Loader } from "../global-components/loader";
import { CustomButtons } from "../global-components/buttons";

const Colors = Color()
const recentTransfers = [
    { id: "1", name: "DE-LAVINO LOUNGE ENTERPRISES - 1", account: "8239804858", bank: "MONIE POINT", icon: "M" },
    { id: "2", name: "Raenest/PAUL CHINOME AMINIGBO", account: "1879662920", bank: "Kredi Money Microfinance Bank", icon: "K" },
    { id: "3", name: "GLADYS IKHINEMEBE EKENEKOT", account: "1532252040", bank: "Access Bank", icon: "A" },
];

const BankTransfer = ({ navigation }) => {
    const { User, Transactions, Loading, SelectedBank, ResolveBank, InitiatePayout, SelectBank, GetAllTransactions, AllBanks } = appState()
    const [AccountNumber, setAccountNumber] = useState("")
    const [Amount, setAmount] = useState(0);
    const [AccountHolder, setAccountHolder] = useState(null)
    const [EnterAmountPop, setEnterAmountPop] = useState(false)
    const [Remark, setRemark] = useState("")

    // Remove duplicates based on 'ref' key
    const uniqueData = Transactions.filter(e => e.type == "BANK-PAYOUT").reduce((acc, current) => {
        if (!acc.find(item => item.data.bank_account.account === current.data.bank_account.account)) {
            acc.push(current);
        }
        return acc;
    }, []);

    const [Search, setSearch] = React.useState("")

    const [suggestions, setSuggestions] = React.useState([]);

    const handleInputChange = (text) => {
        setSearch(text);
        const filteredSuggestions = AllBanks.filter(
            state => state.name.toLowerCase().includes(text.toLowerCase())
        );
        // setSearch(text);
        setSuggestions(filteredSuggestions);
    };

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            GetAllBanks()

        });

        return unsubscribe;

    }, [navigation]);

    return (
        <>
            {/* {console.log(Transactions[0])} */}
            <SafeAreaView style={{ display: "flex", flex: 1, backgroundColor: Colors.white }} >

                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                                <BackIcon />
                                <Text fontSize="lg" fontWeight="bold">Transfer to Bank Account</Text>
                            </HStack>

                            {/* Banner */}
                            <Image
                                source={{ uri: "https://www.myheartland.bank/hs-fs/hubfs/EHASWT%20-%20Feature%20Banners%20(44).png?width=1500&height=420&name=EHASWT%20-%20Feature%20Banners%20(44).png" }}
                                alt="Banner"
                                w="90%"
                                h={20}
                                style={{
                                    alignSelf: "center"
                                }}
                            />

                            {/* Input Fields */}
                            <VStack p={4} space={3} mt={8}
                                style={[{
                                    backgroundColor: "#EAEAEA",
                                    width: "95%",
                                    alignSelf: "center",
                                    borderRadius: 10,
                                }, styles.shadowBox]}>
                                <Text fontWeight="bold">Recipient Account</Text>

                                <TextInput style={{ marginTop: 10 }}
                                    onChangeText={setAccountNumber}
                                    value={AccountNumber}
                                    placeholderTextColor={"grey"}
                                    placeholder="Enter 10 digits Account Number" keyboardType="numeric" />

                                {AccountNumber.length == 10 &&
                                    <>
                                        <Divider style={{
                                            backgroundColor: "lightgrey",
                                            marginVertical: 10,
                                            height: 0.4
                                        }} />
                                        <TouchableOpacity
                                            onPress={() => {
                                                // navigation.navigate("Search-banks")
                                                setEnterAmountPop(true)
                                            }}
                                            style={{
                                                // marginBottom: 40
                                            }}>
                                            <HStack justifyContent="space-between" alignItems="center" width="100%" >
                                                <HStack alignItems="center" space={5} >
                                                    {SelectedBank &&
                                                        <>
                                                            {
                                                                SelectedBank.logo == "https://nigerianbanks.xyz/logo/default-image.png" ?
                                                                    <Center style={{
                                                                        borderRadius: 50,
                                                                        borderColor: Colors.primary,
                                                                        borderWidth: 0.3,
                                                                        width: 35,
                                                                        height: 35
                                                                    }} >
                                                                        <Icon as={<Landmark size={17} />} color={Colors.primary} />
                                                                    </Center>
                                                                    :
                                                                    <Image

                                                                        style={{
                                                                            height: 30, width: 30, borderRadius: 30, zIndex: 1000, marginRight: 10
                                                                        }}
                                                                        source={{
                                                                            uri: SelectedBank && SelectedBank.logo
                                                                        }} alt="logo" size="xl" />
                                                            }
                                                        </>
                                                    }
                                                    <Text color="gray.500">{!SelectedBank ? "Select Bank" : SelectedBank.name}</Text>
                                                </HStack>


                                                <ArrowForward />
                                            </HStack>
                                        </TouchableOpacity>
                                    </>
                                }


                                {!AccountNumber || (AccountNumber.length < 10) || (!SelectedBank) ? "" :
                                    <CustomButtons
                                        callBack={() => {
                                            Keyboard.dismiss()
                                            setAccountNumber("")
                                            ResolveBank(SelectedBank.code, AccountNumber, setAccountHolder, setEnterAmountPop, SelectedBank, navigation)
                                        }}
                                        primary={!AccountNumber || (AccountNumber.length < 10) || (!SelectedBank) ? false : true}
                                        opacity={!AccountNumber || (AccountNumber.length < 10) || (!SelectedBank) ? 0.3 : 1}
                                        text="Next"
                                    />
                                }


                            </VStack>

                            {Transactions && Transactions.filter(e => e.type == "BANK-PAYOUT").length > 0 &&
                                <>
                                    < VStack px={4} py={3} mt={10}
                                        style={[{
                                            backgroundColor: "#EAEAEA",
                                            width: "95%",
                                            alignSelf: "center",
                                            borderRadius: 10,
                                        }, styles.shadowBox]} >
                                        <HStack justifyContent="space-between" mb={5} >
                                            <Text fontWeight="medium">Recents</Text>
                                            {/* <Text color="green.500">Favourites</Text> */}
                                        </HStack>

                                        {uniqueData.map((item, index) => {
                                            return <TouchableOpacity key={index} onPress={() => {
                                                // console.log("item.data", item.data.bank_account.bankLogo)
                                                // setEnterAmountPop(true)
                                                // setAccountHolder({
                                                //     bank_name: item.data.bank_account.bank_name,
                                                //     bank_code: item.data.bank_account.bank,
                                                //     account_number: item.data.bank_account.account,
                                                //     account_name: item.data.receiverName,
                                                //     logo: item.data.bank_account.bankLogo
                                                // })
                                                const Payload = {
                                                    bank_name: item.data.bank_account.bank_name,
                                                    bank_code: item.data.bank_account.bank,
                                                    account_number: item.data.bank_account.account,
                                                    account_name: item.data.receiverName,
                                                    logo: item.data.bank_account.bankLogo
                                                }
                                                navigation.push("Amount-page", { data: Payload })
                                                // console.log()
                                            }} >

                                                <HStack alignItems="center" py={3} >
                                                    {/* {console.log(item)} */}
                                                    <VStack ml={3} flex={1}>
                                                        <Text fontWeight="medium" >{item.data.receiverName}</Text>
                                                        <Text color="gray.400">{item.data.bank_account.account} - {item.data.bank_account.bank_name}</Text>
                                                    </VStack>
                                                </HStack>
                                            </TouchableOpacity>
                                        })}

                                    </VStack>
                                </>
                            }
                        </>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={Loading} onRefresh={() => {
                            GetAllTransactions()
                        }} />
                    }

                />

            </SafeAreaView >

            <Actionsheet isOpen={EnterAmountPop} onClose={() => {
                setEnterAmountPop(!EnterAmountPop)

            }}>
                {/* {console.log(AccountHolder)} */}
                <Actionsheet.Content>
                    <VStack space={4} >
                        <VStack bg="white" shadow={0.1} marginVertical={0} style={{ padding: 10, height: "100%" }}>

                            <HStack p={3} justifyContent="center" alignItems="center" >

                                <TextInput
                                    onChangeText={handleInputChange}
                                    // value={Search}
                                    style={[styles.input, { fontSize: 17, }]}
                                    w={{ md: "95%" }}
                                    // height={21}
                                    flex={5}
                                    rounded={10}
                                    justifyContent="center"
                                    placeholder='Search Bank Name'
                                    placeholderTextColor="grey"
                                    size={25} color="red.400" />

                            </HStack>

                            {Search.length < 1 &&
                                <FlatList
                                    style={styles.suggestions}
                                    data={AllBanks.length > 0 && AllBanks}
                                    renderItem={({ item, index }) => (
                                        <Stack>
                                            {/* {console.log(item)} */}
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setEnterAmountPop(false)
                                                    SelectBank(item)
                                                    // navigation.pop()
                                                }}
                                                style={{
                                                    // backgroundColor: "#F6F6F6",
                                                    marginBottom: 5,
                                                    paddingVertical: 10,
                                                    paddingRight: 10,
                                                    paddingLeft: 20,
                                                    width: "100%",
                                                    // marginLeft: "5%",
                                                    borderRadius: 5,
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }} >
                                                <HStack alignItems="center" space={5} >
                                                    {item.logo == "https://nigerianbanks.xyz/logo/default-image.png" ?
                                                        <Center style={{
                                                            borderRadius: 50,
                                                            borderColor: Colors.primary,
                                                            borderWidth: 0.3,
                                                            width: 35,
                                                            height: 35
                                                        }} >
                                                            <Icon as={<Landmark size={17} />} color={Colors.primary} />
                                                        </Center>
                                                        :
                                                        <Image
                                                            style={{
                                                                height: 30, width: 30, borderRadius: 30, zIndex: 1000, marginRight: 10
                                                            }}
                                                            source={{
                                                                uri: item.logo
                                                            }} alt="logo" size="xl" />
                                                    }
                                                    <BoldText text={item.name} color={Colors.dark} />
                                                </HStack>
                                                <ArrowForward />
                                            </TouchableOpacity>
                                            {AllBanks.length > 1 && <Divider style={{ backgroundColor: Colors.background, height: 0.3 }} />}

                                        </Stack>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            }


                            {Search.length > 0 && suggestions.length > 0 ?
                                <FlatList
                                    style={styles.suggestions}
                                    data={Search.length > 0 && suggestions}
                                    renderItem={({ item, index }) => (
                                        <Stack>
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setEnterAmountPop(false)
                                                    SelectBank(item)
                                                    // navigation.pop()
                                                }}
                                                style={{
                                                    // backgroundColor: "#F6F6F6",
                                                    marginBottom: 5,
                                                    paddingVertical: 10,
                                                    paddingRight: 10,
                                                    paddingLeft: 20,
                                                    width: "100%",
                                                    // marginLeft: "5%",
                                                    borderRadius: 5,
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }} >
                                                <HStack alignItems="center" space={5} >
                                                    {item.logo == "https://nigerianbanks.xyz/logo/default-image.png" ?
                                                        <Center style={{
                                                            borderRadius: 50,
                                                            borderColor: Colors.primary,
                                                            borderWidth: 0.3,
                                                            width: 35,
                                                            height: 35
                                                        }} >
                                                            <Icon as={<Landmark size={17} />} color={Colors.primary} />
                                                        </Center>
                                                        :
                                                        <Image
                                                            style={{
                                                                height: 30, width: 30, borderRadius: 30, zIndex: 1000, marginRight: 10
                                                            }}
                                                            source={{
                                                                uri: item.logo
                                                            }} alt={item.name} size="xl" />}
                                                    <BoldText text={item.name} color={Colors.dark} />
                                                </HStack>
                                                <ArrowForward />
                                            </TouchableOpacity>
                                            {AllBanks.length > 1 && <Divider style={{ backgroundColor: Colors.background, height: 0.3 }} />}

                                        </Stack>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                /> : <>
                                    {Search.length > 0 && <BoldText style={{ marginBottom: 20, marginLeft: 10 }} text="Search matches no Merchant" />}

                                </>}


                        </VStack>

                    </VStack>

                </Actionsheet.Content>
            </Actionsheet>

            <Loader loading={Loading} />
        </>
    );
};

export default BankTransfer;

const styles = StyleSheet.create({

    shadowBox: {
        backgroundColor: '#fff',

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.3,
        shadowRadius: 0.5,
        borderRadius: 6,

        // Shadow for Android
        elevation: 0.4,
    },
    pills: {
        borderColor: "#E6E6E6",
        textAlign: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 0.5
    }
});
