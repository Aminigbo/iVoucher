import React, { useState } from "react";
import { Box, VStack, Text, Input, Button, HStack, Image, Pressable, ScrollView, Divider, Select, CheckIcon, Center, Icon, Actionsheet } from "native-base";
import { FlatList, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft, Landmark, Wifi } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowForward, BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { appState } from "../state";
import { BoldText, BoldText1, BoldText2 } from "../global-components/texts";
import { Loader } from "../global-components/loader";

const Colors = Color()
const recentTransfers = [
    { id: "1", name: "DE-LAVINO LOUNGE ENTERPRISES - 1", account: "8239804858", bank: "MONIE POINT", icon: "M" },
    { id: "2", name: "Raenest/PAUL CHINOME AMINIGBO", account: "1879662920", bank: "Kredi Money Microfinance Bank", icon: "K" },
    { id: "3", name: "GLADYS IKHINEMEBE EKENEKOT", account: "1532252040", bank: "Access Bank", icon: "A" },
];

const BankTransfer = ({ navigation }) => {
    const { User, Transactions, Loading, SelectedBank, ResolveBank, InitiatePayout, SelectBank } = appState()
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

    return (
        <>
            {/* {console.log(Transactions[0])} */}
            <SafeAreaView>

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
                        placeholder="Enter 10 digits Account Number" keyboardType="numeric" />

                    <Divider style={{
                        backgroundColor: "lightgrey",
                        marginVertical: 10,
                        height: 0.4
                    }} />

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Search-banks")
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

                    <TouchableOpacity
                        onPress={() => {
                            // console.log(SelectedBank)
                            Keyboard.dismiss()
                            ResolveBank(SelectedBank.code, AccountNumber, setAccountHolder, setEnterAmountPop, SelectedBank)
                        }}
                        style={{
                            backgroundColor: Colors.dark,
                            padding: 17,
                            borderRadius: 20,
                            alignItems: "center",
                            marginTop: 20,
                            opacity: !AccountNumber || (AccountNumber.length < 10) || (!SelectedBank) ? 0.3 : 1,
                        }}>
                        <Text fontWeight="bold" fontSize={15} color="#fff">Next</Text>
                    </TouchableOpacity>

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
                            <FlatList
                                data={uniqueData}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => {
                                        // console.log("item.data", item.data.bank_account.bankLogo)
                                        setEnterAmountPop(true)
                                        setAccountHolder({
                                            bank_name: item.data.bank_account.bank_name,
                                            bank_code: item.data.bank_account.bank,
                                            account_number: item.data.bank_account.account,
                                            account_name: item.data.receiverName,
                                            logo: item.data.bank_account.bankLogo
                                        })
                                    }} >

                                        <HStack alignItems="center" py={3} borderBottomWidth={1} borderColor="gray.200">
                                            {/* {console.log(item)} */}
                                            <VStack ml={3} flex={1}>
                                                <Text fontWeight="medium" >{item.data.receiverName}</Text>
                                                <Text color="gray.400">{item.data.bank_account.account} - {item.data.bank_account.bank_name}</Text>
                                            </VStack>
                                        </HStack>
                                    </TouchableOpacity>
                                )}
                            />
                        </VStack>
                    </>
                }
                {/* </ScrollView> */}
            </SafeAreaView >

            <Actionsheet isOpen={EnterAmountPop} onClose={() => {
                setEnterAmountPop(!EnterAmountPop)

            }}>
                {/* {console.log(AccountHolder)} */}
                <Actionsheet.Content>
                    {AccountHolder &&
                        <>
                            <HStack mb={15} alignItems="center" space={5} justifyContent="flex-start" mt={2}
                                style={{ width: "95%", backgroundColor: "#E6E6E6", padding: 15, borderRadius: 10 }} >
                                {AccountHolder.logo == "https://nigerianbanks.xyz/logo/default-image.png" ?
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
                                            height: 50, width: 50, borderRadius: 60, backgroundColor: "#fff", padding: 2
                                        }}
                                        source={{
                                            uri: AccountHolder.logo
                                        }} alt="logo" size="xl" />}
                                <VStack>
                                    <BoldText1 text={AccountHolder.account_name} color="#000" size={16} />
                                    <Text color="gray.500">{`${AccountHolder.bank_name} ${AccountNumber}`}</Text>
                                </VStack>
                            </HStack>


                            <View style={[{ padding: 15, width: "100%", marginTop: 20 }, styles.shadowBox]}>
                                <BoldText text={`Amount`} color="#000" />
                                <HStack space={3} style={{
                                    marginTop: 25,
                                    alignItems: "center",
                                }} >
                                    <BoldText2 text="₦" color="#000" />
                                    <TextInput style={[styles.input, { fontSize: 20, fontWeight: 500, color: "#000" }]} placeholder="5,000.00 - 1,000,000.00" onChangeText={setAmount} value={Amount} keyboardType='numeric' />
                                </HStack>
                                <Divider />
                                <HStack mt={4} justifyContent="space-between" paddingVertical={10} >
                                    <TouchableOpacity onPress={() => setAmount("500")} >
                                        <Text style={styles.pills} >₦500.00</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setAmount("1000")}>
                                        <Text style={styles.pills} >₦1,000.00</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setAmount("5000")}>
                                        <Text style={styles.pills} >₦5,000.00</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setAmount("10000")}>
                                        <Text style={styles.pills} >₦10,000.00</Text>
                                    </TouchableOpacity>
                                </HStack>

                            </View>


                            <View style={[{ padding: 15, width: "100%", marginTop: 20 }, styles.shadowBox]}>
                                <BoldText text={`Remark`} color="#000" />
                                <TextInput style={[styles.input, { fontSize: 15, fontWeight: 300, color: "#000", marginTop: 25 }]}
                                    placeholder="What's the payment for?(optional)" onChangeText={setRemark} value={Remark} />
                            </View>


                            <TouchableOpacity
                                onPress={() => {
                                    if (Amount > 99) {
                                        setEnterAmountPop(!EnterAmountPop)
                                        setAccountNumber("")
                                        InitiatePayout({
                                            payoutType: "bank_account",
                                            amount: Amount,
                                            naration: Remark,
                                            bankCode: SelectedBank.code,
                                            account: AccountNumber,
                                            accountName: AccountHolder.account_name,
                                            receiver: null,
                                            bank_name: SelectedBank.name,
                                            navigation,
                                            bankLogo: AccountHolder.logo
                                        })
                                    }
                                }}
                                style={[{
                                    backgroundColor: Colors.dark,
                                    padding: 17,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    marginTop: 50,
                                    width: "95%",
                                    opacity: Amount < 100 ? 0.2 : 1
                                }]}>
                                <BoldText text="Make payment" color="#fff" />
                            </TouchableOpacity>
                        </>
                    }
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
