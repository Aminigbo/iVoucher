import React, { useState } from "react";
import { Box, Text, VStack, HStack, Button, Icon, Divider, Pressable, FlatList, Center, View, Stack } from "native-base";
import { ArrowLeft, User, CheckCircle, Repeat, Clock, AlertCircle, Share2, Repeat2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon, AppLogo2, BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { FetchTransactionHistoryController } from "../helpers/transactions";
import { Loader } from "../global-components/loader";
import { formatDate, NumberWithCommas } from "../utilities";
import { RefreshControl, TouchableOpacity } from "react-native";


import { captureRef } from 'react-native-view-shot';
import ShareLib from 'react-native-share';
import RNFS from 'react-native-fs';


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



  function WaterMark({ top, left }) {
    return <AppIcon
      style={{
        position: "absolute",
        top: top,
        left: left,
        transform: [{ translateX: -20 }, { translateY: -20 }],
        zIndex: 1000
      }}
      color={Colors.primary} opacity={0.3} />
  }

  const qrCodeRef = React.useRef();
  const onShare = async () => {
    try {
      // Capture the QR code view
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1,
      });
      // console.log("onShare", uri)

      // setviewCylinder(!viewCylinder)
      // Share the captured image
      await ShareLib.open({
        url: uri,
        message: "Enjoy seamless transactions with Pocket Voucher.",
      });
      // Delete the image from cache after sharing
      await RNFS.unlink(uri);
      console.log("Image deleted from cache");

    } catch (error) {
      // Delete the image from cache after sharing
      await RNFS.unlink(uri);
      console.log("Image deleted from cache");
      Alert.alert("Error", error.message);
    }
  };



  return (
    <>
      <SafeAreaView flex={1} style={{
        backgroundColor: "#fff"
      }}>

        <HStack space={7} bg="#fff" p={2} style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal:15
        }} >
          <BackIcon />
          <TouchableOpacity
            onPress={() => {
              onShare()
            }}>
            <Text fontSize="lg" fontWeight="bold">Share Receipt</Text>
          </TouchableOpacity>
        </HStack>


        {loading == false &&
          <>
            <FlatList
              // ref={qrCodeRef}
              data={[0]}
              renderItem={() => {
                return <>
                  <Pressable ref={qrCodeRef} p={4} style={{
                    backgroundColor: "#fff",
                    padding: 20
                  }} >

                    {/* Transaction Details */}
                    <Box bg="gray.100" p={4} borderRadius="lg">

                      <HStack justifyContent="space-between" alignItems="center" mb={4} >
                        <AppLogo2 />
                        <VStack>
                          <Text bold fontSize={15}>Transaction Receipt</Text>
                          <Text>{formatDate(data.created_at)}</Text>
                        </VStack>
                      </HStack>

                      <WaterMark top="10%" left="50%" />
                      <WaterMark top="40%" left="80%" />

                      <WaterMark top="70%" left="60%" />
                      <WaterMark top="100%" left="80%" />

                      <WaterMark top="40%" left="20%" />
                      <WaterMark top="70%" left="20%" />
                      <WaterMark top="95%" left="10%" />

                      <Center>
                        <Text fontSize="3xl"
                          fontWeight="bold"
                          color={Colors.dark}>
                          ₦{NumberWithCommas(data.amount)}
                        </Text>
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
                      </Center>

                      <Divider my={6} backgroundColor="gray.200" />

                      <VStack space={3}>
                        {data.data.receiver &&
                          <HStack justifyContent="space-between" my={1}>
                            <Text color="gray.500">Recipient Details</Text>
                            <VStack alignItems="flex-end">
                              <Text>{data.data.receiver.accountName}</Text>
                              <Text>{data.data.receiver.bank_name.length > 10 ? data.data.receiver.bank_name.slice(0, 10) + "..." : data.data.receiver.bank_name} | {data.data.receiver.account}</Text>
                            </VStack>
                          </HStack>
                        }
                        <HStack justifyContent="space-between" my={1} >
                          <Text color="gray.500">Sender Details</Text>
                          <VStack alignItems="flex-end">
                            <Text>{data.data.sender.senderFullname}</Text>
                            <Text>{data.data.sender.senderBankName.length > 10 ? data.data.sender.senderBankName.slice(0, 10) + "..." : data.data.sender.senderBankName} | {data.data.sender.senderAccountNumber.slice(0, 3)}****{data.data.sender.senderAccountNumber.slice(-3)}</Text>
                          </VStack>
                        </HStack>

                        <HStack justifyContent="space-between" my={1} >
                          <Text color="gray.500">Transaction Type</Text>
                          <Text  >{data.data.type}</Text>
                        </HStack>

                        <HStack justifyContent="space-between" my={1} >
                          <Text color="gray.500">Transaction No.</Text>
                          <Text  >{data.data.trxId}</Text>
                        </HStack>

                        <HStack justifyContent="space-between" my={1} >
                          <Text color="gray.500">Reference No.</Text>
                          <Text  >{data.ref}</Text>
                        </HStack>

                        <VStack justifyContent="space-between" my={2} >
                          <Text color="gray.500">Remark.</Text>
                          <Text  >{data.remark}</Text>
                        </VStack>


                      </VStack>
                    </Box>

                    {/* More Actions Section */}
                    <Box bg="gray.100" p={4} borderRadius="lg" mt={1}>
                      <WaterMark top="50%" left="20%" />
                      <WaterMark top="50%" left="40%" />
                      <WaterMark top="50%" left="60%" />
                      <WaterMark top="50%" left="80%" />
                      <Text fontSize="sm" fontWeight="light" mb={2}>
                        Enjoy seamless transactions with Pocket Voucher.
                        Get instant payments, secure transfers, and exclusive
                        rewards. Your convenience, our priority.
                      </Text>
                      <Divider my={2} />

                      <Center>
                        <Text fontSize="xs" fontWeight="light"  >
                          © Pocket Voucher 2025 | PROVICS LTD
                        </Text>
                      </Center>
                    </Box>


                  </Pressable>
                </>
              }}

              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={() => {
                  FetchTransactionHistoryController(setData, data.type, data.ref, setLoading)
                }} />
              }
            />
          </>
        }

      </SafeAreaView>
      {loading && <Loader loading={loading} />}
    </>
  );
};

export default TransactionDetails;
