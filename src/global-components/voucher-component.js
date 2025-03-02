import React from 'react';
import { Text, Box, VStack, HStack, Divider, Stack } from 'native-base';
import { Dimensions } from 'react-native';
import { Color } from './colors';
import { Eye, EyeClose, VisaIcon } from './icons';
import { NumberWithCommas } from '../utilities';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Colors = Color()
export const VoucherComponent = ({ User, totalAmount, seeBal, setseeBal }) => {
    const screenWidth = Dimensions.get('window').width;

    return <>
        <VStack >
            <HStack
                width={screenWidth - 16}
                height={130}
                // borderRadius="md"
                overflow="hidden"
                shadow={2}
                // mt={4}
                // mb={4}
                alignSelf="center"
                style={{
                    borderRadius: 10
                }}
            >
                {/* Left Section (Red Background) */}
                <Box
                    flex={1} style={{
                        backgroundColor: Colors.dark,
                        position: "relative",
                        borderLeftColor: Colors.dark,
                        borderLeftWidth: 3,
                    }} p={3} justifyContent="space-between">
                    <VStack space={1}>
                        <Text color="white" style={{
                            zIndex: 100
                        }} fontSize="2xl" fontWeight="bold">
                            Pocket Voucher
                        </Text>
                    </VStack>
                    <Text color="white" fontSize="xs" mt={2}>
                        {User.bankInfo.account_number} - {User.bankInfo.bank_name}
                    </Text>

                    <Stack style={{
                        height: 130,
                        width: 130,
                        borderRadius: 130,
                        backgroundColor: Colors.primary,
                        opacity: 0.1,
                        position: "absolute",
                        top: -3,
                        left: -30
                    }} />

                </Box>

                {/* Right Section (Black Background) */}
                <Box flex={1}
                    style={{
                        backgroundColor: Colors.dark,
                        position: "relative"
                    }}
                    p={6} justifyContent="space-between">
                    <VStack space={2}>
                        <HStack space={4} >
                            <Text color="white" fontSize="xs"  >
                                Voucher balance
                            </Text>
                            {seeBal ?
                                <TouchableOpacity onPress={() => {
                                    setseeBal(false)
                                }} >
                                    <EyeClose />
                                </TouchableOpacity>
                                : <TouchableOpacity onPress={() => {
                                    setseeBal(true)
                                }} >
                                    <Eye />
                                </TouchableOpacity>}
                        </HStack>

                        <Text color="white" fontSize={25} fontWeight="bold">
                            {seeBal ? <>  ₦{NumberWithCommas(User.wallet)}</> : " *****"}
                        </Text>
                    </VStack>
                    <Stack style={{
                        height: 150,
                        width: 150,
                        borderRadius: 150,
                        backgroundColor: Colors.primary,
                        opacity: 0.2,
                        position: "absolute",
                        bottom: -20,
                        left: -70,
                        zIndex: 1
                    }} />
                    <Stack style={{
                        height: 60,
                        width: 60,
                        borderRadius: 60,
                        backgroundColor: Colors.primary,
                        opacity: 0.2,
                        position: "absolute",
                        bottom: -22,
                        right: 10,
                        zIndex: 1
                    }} />
                </Box>
            </HStack>
            <HStack
                width={screenWidth - 20}
                //   height={200}
                // borderRadius="md"
                overflow="hidden"
                shadow={2}
                mt={0.9}
                // mb={4}
                alignSelf="center"
                display="none"
            >
                {/* Left Section (Red Background) */}
                <Box
                    flex={1} style={{
                        backgroundColor: Colors.dark,
                        position: "relative",
                        borderLeftColor: Colors.primary,
                        borderLeftWidth: 3,
                    }} p={3} justifyContent="space-between">

                    <Text color="lightgrey" fontSize="xs" fontWeight="bold">
                        Terms of use
                    </Text>
                    <Text color="grey" fontSize="xs" mt={1} style={{ zIndex: 100 }} >
                        Do you want to buy this image as part of a package? It can work out cheaper.
                    </Text>

                </Box>

                {/* Right Section (Black Background) */}
                <Box flex={1}
                    style={{
                        backgroundColor: Colors.primary,
                        position: "relative"
                    }}
                    p={6} justifyContent="space-between">
                    <VStack space={2}>
                        <Text color="white" fontSize="xs" mt={2}>
                            17 Merchants →
                        </Text>
                        <Text color="white" fontSize="2xl" fontWeight="bold">
                            ₦7,000,000
                        </Text>
                    </VStack>
                    <Stack style={{
                        height: 150,
                        width: 150,
                        borderRadius: 150,
                        backgroundColor: Colors.dark,
                        opacity: 0.1,
                        position: "absolute",
                        top: -10,
                        left: 30,
                    }} />
                    <Stack style={{
                        height: 60,
                        width: 60,
                        borderRadius: 60,
                        backgroundColor: Colors.dark,
                        opacity: 1,
                        position: "absolute",
                        top: 35,
                        left: -40,
                    }} />
                </Box>
            </HStack>
        </VStack>
    </>
};



export const CardComponent = ({ User, CardInfo }) => {
    const screenWidth = Dimensions.get('window').width;
    return <>
        <VStack >
            <HStack
                width={screenWidth - 30}
                height={200}
                // borderRadius="md"
                overflow="hidden"
                shadow={2}
                // mt={4}
                // mb={4}
                alignSelf="center"
                style={{
                    borderRadius: 10
                }}
            >
                {/* Left Section (Red Background) */}
                <Box
                    flex={1} style={{
                        backgroundColor: Colors.dark,
                        position: "relative",
                        // borderLeftColor: Colors.primary,
                        // borderLeftWidth: 3,
                    }} p={3} justifyContent="space-between">
                    <VStack space={1}>
                        <Text color="white" style={{
                            zIndex: 100
                        }} fontSize="2xl" fontWeight="bold">
                            Pocket Voucher
                        </Text>
                    </VStack>
                    <VStack>
                        <Text color="white" fontSize="lg">
                            {CardInfo ? `${CardInfo.card_holder.first_name} ${CardInfo.card_holder.last_name}` : "-- --"}
                        </Text>
                        <Text color="white" fontSize="xs" >
                            {CardInfo ? `.... ${CardInfo.last_four}` : "-- --"}
                        </Text>
                    </VStack>

                    <Stack style={{
                        height: 130,
                        width: 130,
                        borderRadius: 130,
                        backgroundColor: Colors.white,
                        opacity: 0.1,
                        position: "absolute",
                        top: -3,
                        left: -30
                    }} />

                </Box>

                {/* Right Section (Black Background) */}
                <Box flex={1}
                    style={{
                        backgroundColor: Colors.dark,
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end"
                    }}
                    p={6} justifyContent="space-between">
                    <VStack space={2}>
                        <Text color="white" fontSize={25} fontWeight="bold">
                            ...
                        </Text>
                    </VStack>

                    <VStack >
                        <VisaIcon />
                    </VStack>
                    <Stack style={{
                        height: 150,
                        width: 150,
                        borderRadius: 150,
                        backgroundColor: Colors.white,
                        opacity: 0.2,
                        position: "absolute",
                        bottom: -20,
                        left: -70,
                        zIndex: 1
                    }} />
                    <Stack style={{
                        height: 60,
                        width: 60,
                        borderRadius: 60,
                        backgroundColor: Colors.white,
                        opacity: 0.2,
                        position: "absolute",
                        bottom: -22,
                        right: 10,
                        zIndex: 1
                    }} />
                </Box>
            </HStack>

        </VStack>
    </>
};


// export default VoucherComponent;
