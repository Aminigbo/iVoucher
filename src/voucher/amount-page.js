import React, { useState } from "react";
import { Box, VStack, Text, HStack, Button, Input, Pressable, Image, View, Stack, Actionsheet, Divider } from "native-base";
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { ArrowLeft, Edit, Delete } from "lucide-react-native";
import { CustomButtons } from "../global-components/buttons";
import { Color } from "../global-components/colors";
import { Header } from "../global-components/header";
import { BackIcon } from "../global-components/icons";
import { NumberWithCommas } from "../utilities";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { appState } from "../state";
import { Loader } from "../global-components/loader";
import { BoldText } from "../global-components/texts";

const Colors = Color()
const TransferScreen = ({ navigation, route }) => {
    const { User, Transactions, Loading, SelectedBank, ResolveBank, InitiatePayout, SelectBank, GetAllTransactions } = appState()
    const [amount, setAmount] = useState("0");
    const [confirm, setconfirm] = useState(false);
    const [Data, setData] = useState(route.params.data);
    const [Remark, setRemark] = useState("");

    const handleNumberPress = (num) => {
        setAmount((prev) => (prev === "0" ? num.toString() : prev + num));
    };

    const handleDelete = () => {
        setAmount((prev) => prev.slice(0, -1) || "0");
    };

    const handleBiometricAuth = async () => {
        const rnBiometrics = new ReactNativeBiometrics();

        const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
        const payload = epochTimeSeconds + 'some message';

        const { success, signature } = await rnBiometrics.createSignature({
            promptMessage: 'Sign in with biometrics',
            payload: payload, // Use a meaningful payload
        });

        if (success) {
            // if (User) {
            //     FetchUserInfo()
            // }
            console.log(success)

        } else {
            console.log('Signature creation failed');
        }
    };


    return (
        <>
            <SafeAreaView bg="white" safeArea p={4} style={{
                display: "flex",
                flex: 1,
                backgroundColor: "#fff"
            }} >
                {/* {console.log(Data)} */}
                <View flex={1} p={4} >

                    <HStack space={7} bg="#fff" alignItems="center"
                        style={{ width: "100%", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 19 }} >
                        <HStack space={7} alignItems="center">
                            <BackIcon />
                            <Text fontSize="lg"  >Enter Amount</Text>
                        </HStack>

                    </HStack>

                    <Box bg={Colors.dark} p={4} borderRadius={10} mt={4}>
                        <HStack alignItems="center" space={3}>
                            <Image
                                source={{ uri: Data.logo }}
                                alt="User"
                                size="sm"
                                borderRadius={100}
                                style={{
                                    backgroundColor: "#fff",
                                    padding: 10,
                                    width: 50,
                                    height: 50
                                }}
                            />
                            <VStack flex={1}>
                                <Text color="white" fontSize="md" bold>
                                    {Data.account_name}
                                </Text>
                                <Text color="gray.300" fontSize="sm">
                                    {Data.account_number} • {Data.bank_name}
                                </Text>
                            </VStack>
                            <TouchableOpacity onPress={() => {
                                navigation.pop()
                            }} >
                                <Edit size={20} color="white" />
                            </TouchableOpacity>
                        </HStack>
                    </Box>

                    <Stack my={15} >
                        <Text fontSize="3xl" fontWeight="bold" textAlign="center" mt={8}>
                            ₦{NumberWithCommas(amount)}
                        </Text>
                        <Text color="orange.500" textAlign="center" mt={2}>
                            Amount to transfer
                        </Text>
                    </Stack>

                    <VStack mt={6} space={4} alignItems="center">
                        {["1 2 3", "4 5 6", "7 8 9", " 0 ⌫"].map((row, rowIndex) => (
                            <HStack key={rowIndex} space={16}>
                                {row.split(" ").map((num, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => (num === "⌫" ? handleDelete() : handleNumberPress(num))}
                                        px={6} py={4} rounded={10}
                                    >
                                        {num === "⌫" ? <Delete size={24} color="black" /> : <Text fontSize="2xl" bold>{num}</Text>}
                                    </Pressable>
                                ))}
                            </HStack>
                        ))}
                    </VStack>
                </View>


                <CustomButtons
                    width="90%"
                    callBack={() => {
                        setconfirm(true)
                        // handleResolveToken(token, setVouchers)
                        // setconfirmCreation(false)
                        // settoken("")
                    }}
                    primary={amount > 99 && true}
                    opacity={amount < 100 ? 0.3 : 1}
                    text="Proceed"
                />
            </SafeAreaView>



            <Actionsheet isOpen={confirm} onClose={() => {
                setconfirm(!confirm)

            }}>
                {/* {console.log(AccountHolder)} */}
                <Actionsheet.Content>
                    {/* {AccountHolder && */}
                    <>
                        <Box style={{
                            width: "100%",
                            padding: 10
                        }} >

                            {/* {loading == false && data && <> */}
                            {/* Transaction Status */}
                            <Box bg="gray.100" p={4} borderRadius="lg" alignItems="center">

                                {/* <Text mt={2} fontSize="lg" fontWeight="bold">{"data.message"}</Text> */}
                                <Text fontSize="4xl" fontWeight="bold" color="black">₦{NumberWithCommas(amount)}</Text>

                            </Box>

                            {/* Transaction Details */}
                            <Box bg="gray.100" p={4} borderRadius="lg" mt={4}>
                                <Text fontSize="md" fontWeight="medium" mb={2}>Transaction Details</Text>
                                <VStack space={3}>
                                    <HStack justifyContent="space-between">
                                        <Text color="gray.500">Recipient Name</Text>
                                        <Text fontWeight="medium">{Data.account_name}</Text>
                                    </HStack>
                                    <HStack justifyContent="space-between">
                                        <Text color="gray.500">Account No.</Text>
                                        <Text fontWeight="medium">{Data.account_number}</Text>
                                    </HStack>
                                    <HStack justifyContent="space-between">
                                        <Text color="gray.500">Bank</Text>
                                        <Text fontWeight="medium">{Data.bank_name}</Text>
                                    </HStack>
                                    <HStack justifyContent="space-between">
                                        <Text color="gray.500">Charge</Text>
                                        <Text fontWeight="medium">₦{NumberWithCommas(0)} </Text>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* More Actions Section */}
                            {/* <Box bg="gray.100" p={4} borderRadius="lg" mt={4}>
                                <Text fontSize="md" fontWeight="bold" mb={2}>More Info</Text>
                                <Pressable py={2}>
                                    <HStack justifyContent="space-between">
                                        <Text>Transaction type</Text>
                                        <Text fontWeight="bold" color="gray.500">{2 == "IN" ? "PAY-IN" : "PAY-OUT"}</Text>
                                    </HStack>
                                </Pressable>
                                <Divider my={2} />
                            </Box> */}

                            <View style={[{ padding: 15, width: "100%", marginTop: 20 }, styles.shadowBox]}>
                                <BoldText text={`Remark`} color="#000" />
                                <TextInput style={[{ fontSize: 15, fontWeight: 300, color: "#000", marginTop: 25 }]}
                                    placeholder="What's the payment for?(optional)"
                                    placeholderTextColor="grey"
                                    onChangeText={setRemark} value={Remark} />
                            </View>

                            {/* </>} */}
                        </Box>


                        <CustomButtons
                            width="90%"
                            callBack={() => {
                                setconfirm(false)
                                // handleBiometricAuth()
                                if (amount > 99) {
                                    setconfirm(false)
                                    setAmount("0")
                                    InitiatePayout({
                                        payoutType: "bank_account",
                                        amount: amount,
                                        naration: "Remark",
                                        bankCode: Data.bank_code,
                                        account: Data.account_number,
                                        accountName: Data.account_name,
                                        receiver: null,
                                        bank_name: Data.bank_name,
                                        navigation,
                                        bankLogo: Data.logo
                                    })
                                }
                            }}
                            primary={true}
                            opacity={1}
                            text="Make payment"
                        />
                    </>
                    {/* } */}
                </Actionsheet.Content>
            </Actionsheet>

            <Loader loading={Loading} />
        </>
    );
};

export default TransferScreen;


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
