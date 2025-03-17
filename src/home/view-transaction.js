import React, { useState } from "react";
import { Box, Text, VStack, HStack, Button, Icon, Divider, Pressable, FlatList } from "native-base";
import { ArrowLeft, User, CheckCircle, Repeat, Clock, AlertCircle, Share2, Repeat2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { FetchTransactionHistoryController } from "../helpers/transactions";
import { Loader } from "../global-components/loader";
import { formatDate, NumberWithCommas } from "../utilities";
import { RefreshControl } from "react-native";

const Colors = Color()

const TransactionDetails = ({ navigation, route }) => {
    const [data, setData] = useState(route.params.data)
    const [loading, setLoading] = useState(true)


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            FetchTransactionHistoryController(setData, data.type, data.ref, setLoading)
        });
        return unsubscribe;
    }, [navigation]);


    return (
        <>
            {/* {console.log(data)} */}
            <SafeAreaView flex={1} style={{
                 backgroundColor:Colors.white
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

                                        <Text mt={2} fontSize="lg" fontWeight="bold">{data.message}</Text>
                                        <Text fontSize="2xl" fontWeight="bold" color="black">₦{NumberWithCommas(data.amount)}</Text>

                                        {data.status == "success" && <HStack space={3}>
                                            <Text color="green.500">{data.status}</Text>
                                            <Icon as={<CheckCircle size="20" color="green" />} />
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
                                                    <Text fontWeight="medium" color="black">{data.data.receiverName}</Text>
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
                                        {/* <HStack justifyContent="space-between">
                                            <Button
                                                variant="ghost"
                                                // color={Colors.dark}
                                                leftIcon={<Icon as={Repeat2} size="5" color={Colors.dark} />}
                                                flex={1}
                                                borderRadius="xl"

                                            >
                                                <Text color={Colors.dark}> Transfer Again</Text>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                leftIcon={<Icon as={Clock} size="5" color={Colors.dark} />}
                                                flex={1}
                                                borderRadius="xl"
                                            >
                                                <Text color={Colors.dark}> View Records</Text>
                                            </Button>
                                        </HStack> */}
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

                {/* {loading == false && <>
                    <Box position="absolute" bottom={4} left={4} right={4}>
                        <HStack justifyContent="space-between" space={10} m={5} >
                            <Button
                                variant="outline"
                                colorScheme="red" 
                                flex={1}
                                mr={2}
                                borderRadius={20}
                                p={3}
                            >
                                Report an issue
                            </Button>
                            <Button
                                colorScheme={Colors.dark} 
                                flex={1}
                                borderRadius={20}
                            >
                                Share Receipt
                            </Button>
                        </HStack>
                    </Box>
                </>} */}

            </SafeAreaView>
            <Loader loading={loading} />
        </>
    );
};

export default TransactionDetails;
