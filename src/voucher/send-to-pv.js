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


const PocketVoucherTransfer = ({ navigation }) => {
    const { Transactions, Loading, SelectedBank, AllUsers, InitiatePayout, GetAllUsers, User, GetAllTransactions } = appState()
    const [AccountNumber, setAccountNumber] = useState("")
    const [Amount, setAmount] = useState(0);
    const [AccountHolder, setAccountHolder] = useState(null)
    const [EnterAmountPop, setEnterAmountPop] = useState(false)
    const [Remark, setRemark] = useState("")

    const [suggestions, setSuggestions] = React.useState([]);

    const handleInputChange = (text) => {
        setAccountNumber(text);
        const filteredSuggestions = AllUsers.filter(
            state => state.phone.toLowerCase() == text.toLowerCase()
        );
        // setSearch(text);
        setSuggestions(filteredSuggestions);
    };

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            GetAllTransactions()
            GetAllUsers()
        });

        return unsubscribe;

    }, [navigation]);


    // Remove duplicates based on 'ref' key
    const uniqueData = Transactions.filter(e => e.type == "PV-PAYOUT").reduce((acc, current) => {
        if (!acc.find(item => item.data.bank_account.account === current.data.bank_account.account)) {
            acc.push(current);
        }
        return acc;
    }, []);

    return (
        <>
            {/* {console.log(User.phone)} */}
            <SafeAreaView style={{
                display: "flex",
                flex: 1,
                backgroundColor:Colors.white
            }} >
                <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                    <BackIcon />
                    <Text fontSize="lg" fontWeight="bold">Transfer to Pocket Voucher</Text>
                </HStack>


                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
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

                                <TextInput style={{ marginTop: 10, borderWidth: 0.4, padding: 15, borderColor: "grey", borderRadius: 10 }}
                                    // onChangeText={setAccountNumber}
                                    onChangeText={handleInputChange}
                                    value={AccountNumber}
                                    placeholderTextColor='grey'
                                    placeholder="Phone Number./ Name / Email" />


                                <Text color="#459978" fontWeight="light">Free, Fast, & Easy</Text>

                            </VStack>


                            {AccountNumber.length > 0 && suggestions.length > 0 &&

                                suggestions.map((item, index) => {
                                    return <Stack>
                                        {item.phone.slice(-10) != User.phone &&
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setEnterAmountPop(true)
                                                    setAccountHolder({
                                                        AccountNumber: item.phone.slice(-10),
                                                        account_name: `${item.firstName} ${item.lastName}`,
                                                        id: item.userID,
                                                    })
                                                }}
                                                style={{
                                                    backgroundColor: "#F6F6F6",
                                                    marginBottom: 4,
                                                    paddingVertical: 10,
                                                    paddingRight: 10,
                                                    paddingLeft: 20,
                                                    width: "100%",
                                                    borderRadius: 5,
                                                    flexDirection: "row",
                                                }} >
                                                <VStack alignItems="flex-start" py={3} >
                                                    <Text fontWeight="medium" >{`${item.firstName} ${item.lastName}`}</Text>
                                                    <Text color="gray.400">Pocket Voucher - {item.phone.slice(-10)}</Text>
                                                </VStack>
                                            </TouchableOpacity>
                                        }

                                    </Stack>
                                })
                            }


                            {Transactions && Transactions.filter(e => e.type == "PV-PAYOUT").length > 0 &&

                                <VStack px={4} py={3} mt={10}
                                    style={[{
                                        backgroundColor: "#EAEAEA",
                                        width: "95%",
                                        alignSelf: "center",
                                        borderRadius: 10,
                                    }, styles.shadowBox]} >
                                    <HStack justifyContent="space-between" mb={5} >
                                        <Text fontWeight="medium">Recents</Text>
                                    </HStack>
                                    {uniqueData.filter(e => e.type == "PV-PAYOUT").map((item, index) => {
                                        return <TouchableOpacity onPress={() => {
                                            setEnterAmountPop(true)
                                            setAccountHolder({
                                                AccountNumber: item.data.bank_account.account,
                                                account_name: item.data.bank_account.name,
                                                id: item.to,
                                            })
                                        }} >
                                            <HStack alignItems="center" py={3} >
                                                <VStack ml={3} flex={1}>
                                                    <Text fontWeight="medium" >{item.data.receiverName}</Text>
                                                    <Text color="gray.400">{item.data.bank_account.account} - {item.data.bank_account.bank_name}</Text>
                                                </VStack>
                                            </HStack>
                                        </TouchableOpacity>
                                    })}

                                </VStack>
                            }
                        </>

                    }}

                    refreshControl={
                        <RefreshControl refreshing={Loading} onRefresh={() => {
                            GetAllTransactions();
                            GetAllUsers()
                        }} />
                    }


                />

            </SafeAreaView >

            <Actionsheet isOpen={EnterAmountPop} onClose={() => {
                setEnterAmountPop(!EnterAmountPop)
            }}>
                <Actionsheet.Content>
                    {AccountHolder &&
                        <>
                            <HStack mb={15} alignItems="center" space={5} justifyContent="flex-start" mt={2}
                                style={{ width: "95%", backgroundColor: "#E6E6E6", padding: 15, borderRadius: 10 }} >

                                <VStack>
                                    <BoldText1 text={AccountHolder.account_name} color="#000" size={16} />
                                    <Text color="gray.500">{`${AccountHolder.AccountNumber}`}</Text>
                                </VStack>
                            </HStack>


                            <View style={[{ padding: 15, width: "100%", marginTop: 20 }, styles.shadowBox]}>
                                <BoldText text={`Amount`} color="#000" />
                                <HStack space={3} style={{
                                    marginTop: 25,
                                    alignItems: "center",
                                }} >
                                    <BoldText2 text="₦" color="#000" />
                                    <TextInput style={[styles.input, { fontSize: 20, fontWeight: 500, color: "#000", width: "95%", padding: 10 }]} placeholder="5,000.00 - 1,000,000.00" onChangeText={setAmount} value={Amount} keyboardType='numeric' />
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
                                <TextInput style={[styles.input, { fontSize: 15, fontWeight: 300, color: "#000", marginTop: 25, }]}
                                    placeholder="What's the payment for?(optional)" onChangeText={setRemark} value={Remark} />
                            </View>

                            <CustomButtons
                                callBack={() => {
                                    if (Amount > 99) {
                                        setEnterAmountPop(!EnterAmountPop)
                                        setSuggestions([])
                                        setAccountNumber("")
                                        setRemark("")
                                        setAmount(0)
                                        InitiatePayout({
                                            payoutType: "pocket_voucher",
                                            amount: Amount,
                                            naration: Remark,
                                            receiver: {
                                                number: AccountHolder.AccountNumber,
                                                name: AccountHolder.account_name,
                                                id: AccountHolder.id,
                                            },
                                            navigation
                                        })
                                    }
                                }}
                                primary={Amount > 99 && true}
                                opacity={Amount < 100 ? 0.2 : 1}
                                text="Make payment"
                            />

                        </>
                    }
                </Actionsheet.Content>
            </Actionsheet>

            <Loader loading={Loading} />
        </>
    );
};

export default PocketVoucherTransfer;

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
