import React from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, CheckCircleIcon, Actionsheet, Image, Center, AlertDialog } from 'native-base';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { AcceptanceIcon, ArrowForward, BackIcon, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, ScanIcon, SecureIcon, SendVoucherIcon, ShopIcon, VoucherIcon } from '../global-components/icons';
import VoucherComponent from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButtons } from '../global-components/buttons';
import { Merchant } from '../utilities/data';
import { connect } from 'react-redux';
import { User } from '../redux';
import { AddMerchantService } from './services';
import { appState } from '../state';

const Colors = Color()

function Merchants({ navigation }) {
    const { User, login } = appState()
    const [Search, setSearch] = React.useState("")
    const [showmerchantInfo, setshowmerchantInfo] = React.useState(false)
    const [merchantObject, setmerchantObject] = React.useState(null)
    const [loading, setloading] = React.useState(false)
    const cancelRef = React.useRef(null);

    const [suggestions, setSuggestions] = React.useState([]);

    const handleInputChange = (text) => {
        setSearch(text);
        const filteredSuggestions = Merchant.filter(
            state => state.name.toLowerCase().includes(text.toLowerCase())
        );
        // setSearch(text);
        setSuggestions(filteredSuggestions);
    };

    const handleAddMerchant = () => {
        setloading(!loading)

        let payload = {
            merchant: merchantObject,
            user: User.id
        }

        AddMerchantService(payload)
            .then(response => {
                if (response.success == false) {
                    setloading(false)
                    Alert.alert("Error", response.message)
                } else {
                    setloading(false)
                    // User.push({
                    //     ...User,
                    //     merchants: response.data.merchants
                    // })
                    login({
                        ...User,
                        merchants: response.data.merchants
                    })
                    let actualMerchant = response.data.merchants.filter(e => e.id == merchantObject.id)[0]
                    navigation.replace("Merchant-profile", { data: actualMerchant })
                }
            })
            .catch(error => {
                setloading(false)
            })
    }


    return (
        <>
            {/* {console.log(User.merchants)} */}

            <SafeAreaView style={{
                backgroundColor: "#fff", flex: 1
            }} >
                <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                    <BackIcon />
                    <Text fontSize="lg" fontWeight="bold">Add merchant</Text>
                </HStack>

                <VStack space={4}>
                    <VStack bg="white" shadow={0.1} marginVertical={0}>

                        <HStack p={3} justifyContent="center" alignItems="center" >

                            <TextInput
                                onChangeText={handleInputChange}
                                value={Search}
                                style={[styles.input, { fontSize: 17, }]}
                                w={{ md: "95%" }}
                                // height={21}
                                flex={5}
                                rounded={10}
                                justifyContent="center"
                                placeholder='Enter merchant name to search'
                                // InputLeftElement={<SearchAlt />}
                                size={25} color="red.400" />

                            {/* <TextInput
                                    style={styles.input}
                                    onChangeText={(e) => {
                                        onChangeNumber(e)
                                    }}
                                    value={number}
                                    placeholder="Enter merchant name"
                                    keyboardType="default"
                                /> */}

                        </HStack>


                        {Search.length > 0 && suggestions.length > 0 ?
                            <FlatList
                                style={styles.suggestions}
                                data={Search.length > 0 && suggestions}
                                renderItem={({ item, index }) => (
                                    <Stack>
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                setmerchantObject(item)
                                                setshowmerchantInfo(!showmerchantInfo)
                                                setSuggestions([]);
                                                setSearch("")
                                            }}
                                            style={{
                                                // backgroundColor: "#F6F6F6",
                                                marginBottom: 4,
                                                paddingVertical: 10,
                                                paddingRight: 10,
                                                paddingLeft: 20,
                                                width: "100%",
                                                // marginLeft: "5%",
                                                borderRadius: 5,
                                                flexDirection: "row",
                                                justifyContent: "space-between"
                                            }} >
                                            <HStack alignItems="center" >
                                                <Image
                                                    style={{
                                                        height: 35, width: 35, borderRadius: 40, zIndex: 1000, marginRight: 10
                                                    }}
                                                    source={{
                                                        uri: item.img
                                                    }} alt={item.name} size="xl" />

                                                <BoldText1 text={item.name} color={Colors.dark} />
                                            </HStack>
                                            <ArrowForward />
                                        </TouchableOpacity>
                                        {suggestions.length > 1 && <Divider />}

                                    </Stack>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            /> : <>
                                {Search.length > 0 && <BoldText style={{ marginBottom: 20, marginLeft: 10 }} text="Search matches no Merchant" />}

                            </>}


                    </VStack>

                </VStack>

            </SafeAreaView>


            <Actionsheet isOpen={showmerchantInfo} onClose={() => {
                setshowmerchantInfo(!showmerchantInfo)
            }}>
                {merchantObject &&
                    <Actionsheet.Content>

                        {merchantObject && <Image
                            style={{
                                width: "40%",
                                zIndex: 1000,
                                marginRight: 10,
                                marginTop: 20
                            }}
                            source={{
                                uri: merchantObject.img
                            }} alt={"item.name"} size="xl" />}


                        <Center mb={10} mt={5} >
                            {merchantObject && <Text fontWeight="bold" fontSize={20} >{merchantObject.name}</Text>}

                            <Text color="gray.500" p={7} >You will be able to transaction with {merchantObject.name} when you add them to your merchant list</Text>
                        </Center>

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            setshowmerchantInfo(!showmerchantInfo)
                            handleAddMerchant()
                        }} >
                            <Text style={styles.registerButtonText}>
                                {merchantObject && <BoldText color={Colors.white} size={16} text={`Add ${merchantObject.name}`} />}
                            </Text>
                        </TouchableOpacity>

                    </Actionsheet.Content>
                }
            </Actionsheet>


            {/* Almost there loader */}
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={loading} onClose={null}>
                <AlertDialog.Content>
                    <AlertDialog.Body>
                        <VStack alignItems="center" space={6}>
                            <ActivityIndicator size={30} color={Colors.primary} />
                            <BoldText text="Adding merchant" color={Colors.dark} size={16} />
                        </VStack>
                    </AlertDialog.Body>
                </AlertDialog.Content>
            </AlertDialog>


        </>
    );
}



export default Merchants;


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    paymentBtns: {

        backgroundColor: Colors.dark,
        // backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 3,
        width: "90%",
        borderWidth: 1,
        height: 55,
    },

    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },

    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },
});
