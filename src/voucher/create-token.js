import React from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, CheckCircleIcon, Input, Actionsheet, Image, Center } from 'native-base';
import { Alert, FlatList, Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { AcceptanceIcon, ArrowForward, BackIcon, CloseIcon, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, ScanIcon, SecureIcon, SendVoucherIcon, ShopIcon, VoucherIcon } from '../global-components/icons';
import VoucherComponent from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButtons } from '../global-components/buttons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Merchant } from '../utilities/data';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import { formatDate } from '../utilities';
import { CreateTokenService } from './services';
import { connect } from 'react-redux';
import { User } from '../redux';
import { appState } from '../state';

const Colors = Color()

function CreateToken({ route, navigation }) {
    const { User, login } = appState()
    
    const [amount, setamount] = React.useState("")
    const [data, setData] = React.useState(route.params.data)
    const [loading, setLoading] = React.useState(false)
    const [showmerchantInfo, setshowmerchantInfo] = React.useState(false)
    const [merchantObject, setmerchantObject] = React.useState(null)
    const [showPicker, setShowPicker] = React.useState()
    const [date, setDate] = React.useState(new Date());
    const cancelRef = React.useRef(null);
    const [isExpiry, setisExpiry] = React.useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios'); // Close the picker for iOS when a date is selected
        setDate(currentDate);
        setisExpiry(!isExpiry)
        // Perform actions with the selected date as needed
    };

    // Calculate the minimum date as a day after tomorrow
    const minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate() + 2); // Add 2 days

    // Calculate the maximum date as a day after tomorrow
    const maximumDate = new Date();
    maximumDate.setDate(maximumDate.getDate() + 12); // Add 2 days


    function handleCreateToken() {
        Keyboard.dismiss()
        setLoading(!loading)
        CreateTokenService({
            user: User.id,
            amount,
            merchant: data.id,
            walletAdress: data.address,
            expiry: isExpiry ? date : "false"
        })
            .then(response => {
                setLoading(false)
                if (response.success == false) {
                    return Alert.alert("Error", response.message)
                }

                login({
                    ...User,
                    merchants: response.data.merchants
                })

                Alert.alert("Success", response.message, [
                    {
                        onPress: () => { 
                            // console.log(response.data.merchants.filter(e=> e.id == data.id))
                            navigation.pop()
                         },
                        text: "Done"
                    }
                ])

            })
            .catch(error => {
                setLoading(false)
            })
    }


    return (
        <>
            {/* {console.log(merchantObject)} */}
            <SafeAreaView style={{
                backgroundColor: "#fff", flex: 1, display: "flex"
            }} >
                <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                    <BackIcon />
                    <Text fontSize="lg" fontWeight="bold">Genesis voucher token </Text>
                </HStack>

                <VStack space={4}>
                    <VStack bg="white" shadow={0.1} marginVertical={0}>

                        <HStack p={3} justifyContent="center" alignItems="center" >

                            <Input
                                onChangeText={(e) => setamount(e)}
                                value={amount}
                                style={{ fontSize: 17, }}
                                w={{ md: "95%" }}
                                height={60}
                                flex={5}
                                rounded={10}
                                justifyContent="center"
                                keyboardType='numeric'
                                placeholder='Enter amount'
                                // InputLeftElement={<SearchAlt />}
                                size={25} color="black.400" />


                        </HStack>
                    </VStack>



                    {isExpiry ?
                        <TouchableOpacity onPress={() => {
                            setisExpiry(!isExpiry)
                        }} >
                            <HStack space={2} bg="#fff" alignItems="center" style={{ paddingLeft: 10 }}>
                                <CloseIcon style={{ backgroundColor: Colors.dark, padding: 10, borderRadius: 5, color: "#fff" }} />
                                <Text fontSize="xs" fontWeight="bold">Expires on the {formatDate(date)}</Text>
                            </HStack>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => setShowPicker(!showPicker)} >
                            <HStack space={2} bg="#fff" alignItems="center" style={{ paddingLeft: 10 }}>
                                <AddIcon style={{ backgroundColor: Colors.dark, padding: 10, borderRadius: 5, color: "#fff" }} />
                                <Text fontSize="xs" fontWeight="bold">Add expiry date</Text>
                            </HStack>
                        </TouchableOpacity>
                    }



                    {
                        showPicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date" // Set mode to 'time' for time-only picker or 'datetime' for both date and time
                                display="default" // Set display options: 'default', 'spinner', 'calendar'
                                onChange={onChange}
                            // minimumDate={minimumDate} // Set the minimumDate
                            // maximumDate={maximumDate} // Set the maximumDate
                            />
                        )
                    }


                </VStack>

            </SafeAreaView>


            <Stack p={5} bgColor="#fff" >
                <CustomButtons callBack={handleCreateToken}
                    primary Loading={loading}
                    LoadingText="Creating token..."
                    width="100%" height={58} text="Create Token" />
            </Stack>



            <Actionsheet isOpen={showmerchantInfo} onClose={() => {
                setshowmerchantInfo(!showmerchantInfo)
            }}>
                <Actionsheet.Content>

                    <Image
                        style={{
                            width: "40%",
                            zIndex: 1000,
                            marginRight: 10
                        }}
                        source={{
                            uri: `https://res.cloudinary.com/deep-impact-ag/image/upload/v1704834149/konsider/Spar_Schweiz_Express_Shop_PD_ndsz0v.jpg`
                        }} alt={"item.name"} size="xl" />

                    <Center mb={10} mt={5} >
                        {merchantObject && <Text fontWeight="bold" fontSize={20} >{merchantObject.name}</Text>}

                        <Text color="gray.500">Invite friends and earn up to ₦4,200 Cash</Text>
                    </Center>



                    <Actionsheet.Item

                        style={[styles.paymentBtns, {
                            marginVertical: 30,
                            opacity: 3 == 2 ? 0.2 : 1
                        }]}
                        onPress={() => { setshowmerchantInfo(!showmerchantInfo) }} >
                        <HStack style={{
                            justifyContent: "space-between",
                            width: "100%",
                        }} >
                            {merchantObject && <BoldText color={Colors.dark} size={16} text={`Add ${merchantObject.name}`} />}

                            <ArrowForward />
                        </HStack>
                    </Actionsheet.Item>

                </Actionsheet.Content>
            </Actionsheet>


        </>
    );
}

 

export default  CreateToken;


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    paymentBtns: {

        // backgroundColor: Colors.primary,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 3,
        width: "90%",
        borderWidth: 1,
        height: 55,
        // marginTop: 30,
        // marginBottom: 30,


    }
});
