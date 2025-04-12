import React, { useState } from "react";
import { Box, Text, VStack, HStack, Button, Icon, Divider, Pressable, FlatList } from "native-base";
import { ArrowLeft, CheckCircle, Repeat, Clock, AlertCircle, Share2, Repeat2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLogo2, BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { FetchTransactionHistoryController } from "../helpers/transactions";
import { Loader } from "../global-components/loader";
import { formatDate, NumberWithCommas } from "../utilities";
import { RefreshControl } from "react-native";
import { appState } from "../state";

const Colors = Color()

const TransactionDetails = ({ navigation, route }) => {
    const [data, setData] = useState(route.params.data)
    const [loading, setLoading] = useState(true)
    let { User } = appState()

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            FetchTransactionHistoryController(setData, data.type, data.ref, setLoading)
        });
        return unsubscribe;
    }, [navigation]);


    return (
        <>
            {/* {console.log(data.data)} */}
            <SafeAreaView flex={1} style={{
                backgroundColor: "#fff"
            }}>
                <Box p={4}>
                    <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                        <BackIcon />
                        <Text fontSize="lg" fontWeight="bold">Transaction details</Text>
                    </HStack>
                </Box>


                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <Box p={4}>



                                {loading == false && data && <>
                                    {/* Transaction Status */}
                                    <Box bg="gray.100" p={4} borderRadius="lg" alignItems="center">


                                        {data.data.receiver && <Text mt={2} fontSize="lg" fontWeight="medium">
                                            Transfer {data.user == User.id ? "to " : "from "}
                                            {data.user == User.id ? data.data.receiver.accountName : data.data.sender.senderFullname}
                                        </Text>}

                                        <Text
                                            style={{
                                                marginTop: 10
                                            }}
                                            fontSize="3xl" fontWeight="bold" color="black">{data.data.type == "USD CARD" ? "$" : "₦"}{NumberWithCommas(data.amount)}</Text>

                                        {data.status == "success" && <HStack space={3}>
                                            <Text color={Colors.primary}>{data.status}</Text>
                                            <Icon as={<CheckCircle size="20" color={Colors.primary} />} />
                                        </HStack>}
                                        {data.status == "processing" &&
                                            <HStack space={3}>
                                                <Text color="orange.500">{data.status}</Text>
                                                <Icon as={<CheckCircle size="20" color="orange" />} />
                                            </HStack>}
                                        {data.status == "pending" &&
                                            <HStack space={3}>
                                                <Text color="orange.500">{data.status}</Text>
                                                <Icon as={<CheckCircle size="20" color="orange" />} />
                                            </HStack>}
                                    </Box>

                                    {/* Transaction Details */}
                                    <Box bg="gray.100" p={4} borderRadius="lg" mt={4}>
                                        <Text fontSize="md" fontWeight="medium" mb={2}>Transaction Details</Text>
                                        <VStack space={3}>
                                            {data.data.receiverName &&
                                                <HStack justifyContent="space-between">
                                                    <Text color="gray.500">Recipient Details</Text>
                                                    <Text fontWeight="medium" color="black">{data.data.receiver.accountName}</Text>
                                                </HStack>
                                            }
                                            <HStack justifyContent="space-between">
                                                <Text color="gray.500">Transaction Type</Text>
                                                <Text fontWeight="medium">{data.data.type}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text color="gray.500">Transaction No.</Text>
                                                <Text fontWeight="medium">{data.ref}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text color="gray.500">Payment Method</Text>
                                                <Text fontWeight="medium">{data.data.method}</Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text color="gray.500">Transaction Date</Text>
                                                <Text fontWeight="medium"> {formatDate(data.created_at)} </Text>
                                            </HStack>
                                        </VStack>
                                    </Box>

                                    {/* More Actions Section */}
                                    <Box bg="gray.100" p={4} borderRadius="lg" mt={4}>
                                        <Text fontSize="md" fontWeight="bold" mb={2}>More Info</Text>
                                        <Pressable py={2}>
                                            <HStack justifyContent="space-between">
                                                <Text>Transaction</Text>
                                                <Text fontWeight="bold" color="gray.500">{data.flow == "IN" ? "PAY-IN" : "PAY-OUT"}</Text>
                                            </HStack>
                                        </Pressable>
                                        <Divider my={2} />
                                        {data.data.sender &&
                                            <HStack justifyContent="space-between" my={1} >
                                                <Text color="gray.500">Sender Details</Text>
                                                <VStack alignItems="flex-end">
                                                    <Text>{data.data.sender.senderFullname}</Text>
                                                    <Text>{data.data.sender.senderBankName.length > 10 ? data.data.sender.senderBankName.slice(0, 10) + "..." : data.data.sender.senderBankName} | {data.data.sender.senderAccountNumber}</Text>
                                                </VStack>
                                            </HStack>
                                        }

                                    </Box>

                                    {/* Bottom Buttons */}
                                </>}
                            </Box>
                        </>
                    }}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => {
                            FetchTransactionHistoryController(setData, data.type, data.ref, setLoading)
                        }} />
                    }
                />

                {loading == false && data.data.sender && <>
                    <Box position="absolute" bottom={4} left={4} right={4}>
                        <HStack justifyContent="space-between" space={10} m={5} >

                            <Button
                                variant="outline"
                                onPress={() => {
                                    navigation.navigate("Transaction-receipt", {
                                        data: data
                                    })
                                }}
                                colorScheme={Colors.dark}
                                flex={1}
                                borderRadius={20}
                                style={{
                                    height: 55
                                }}
                            >
                                See Receipt
                            </Button>
                        </HStack>
                    </Box>
                </>}

            </SafeAreaView>
            <Loader loading={loading} />
        </>
    );
};

export default TransactionDetails;
