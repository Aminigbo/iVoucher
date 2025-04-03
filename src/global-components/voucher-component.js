import React from 'react';
import { Text, Box, VStack, HStack, Divider, Stack, Center } from 'native-base';
import { ActivityIndicator, Dimensions, Platform } from 'react-native';
import { Color } from './colors';
import { AppIcon, AppLogo2, Eye, EyeClose, VisaIcon } from './icons';
import { NumberWithCommas } from '../utilities';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Asterisk, Ellipsis } from 'lucide-react-native';
const Colors = Color()
export const VoucherComponent = ({ User, totalAmount, seeBal, setseeBal, loading }) => {
    const screenWidth = Dimensions.get('window').width;

    return <>
    {console.log(User.bankInfo)}
        {User.bankInfo &&
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
                            {/* <AppIcon color={Colors.secondary} /> */}
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

                            {loading ?
                                <Text color="white" fontSize={25} fontWeight="bold">
                                    <ActivityIndicator />
                                </Text>
                                :
                                <Text color="white" fontSize={25} fontWeight="bold">
                                    {seeBal ? <>  ₦{NumberWithCommas(User.wallet)}</> : " *****"}
                                </Text>
                            }
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
        }

    </>
};



export const CardComponent = ({ User, CardInfo, setCardInfo, setclaimCard, setbottomSheetType, GetCardDetails }) => {
    const screenWidth = Dimensions.get('window').width;
    return <>
        <VStack >
            <HStack
                width={screenWidth - 30}
                height={Platform.OS === 'ios' ? 180 : 150}
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
                        <Text fontSize={14}
                            fontWeight="light"
                            color={Colors.white}
                        >
                            Card balance
                        </Text>
                        <Text color="white" style={{
                            zIndex: 100
                        }} fontSize="2xl" fontWeight="bold">
                            {CardInfo ? `$ ${NumberWithCommas(CardInfo.balance)}.00` : "--.--"}
                        </Text>
                    </VStack>
                    <VStack>
                        <Text color="white" fontSize="lg">
                            {CardInfo ? `${CardInfo.card_holder.first_name} ${CardInfo.card_holder.last_name}` : "-- --"}
                        </Text>
                        <Text color="white" fontSize="xs" >
                            {CardInfo ? <> <Asterisk size={12} color="white" /> <Asterisk size={12} color="white" /> <Asterisk size={12} color="white" /> <Asterisk size={12} color="white" /> {CardInfo.last_four}</> : "-- --"}
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
                        // backgroundColor: "red",
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between"
                    }}
                    p={4}
                >
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 10,
                            borderRadius: 10
                        }}
                        onPress={() => {
                            CardInfo && GetCardDetails(setCardInfo, setclaimCard, setbottomSheetType)
                        }} >
                        <Ellipsis size={25} color="white" />
                    </TouchableOpacity>

                    <VStack >
                        <VisaIcon />
                    </VStack>

                    <Center style={{
                        height: Platform.OS === 'ios' ? 120 : 100,
                        width: Platform.OS === 'ios' ? 120 : 100,
                        borderRadius: 150,
                        backgroundColor: Colors.white,
                        opacity: 0.4,
                        position: "absolute",
                        bottom: -20,
                        left: Platform.OS === 'ios' ? -50 : -20,
                        zIndex: 1
                    }} >
                        <AppIcon color={Colors.dark} />
                        {/* <AppLogo2 /> */}
                    </Center>

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
