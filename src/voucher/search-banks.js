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
import { Landmark, X } from 'lucide-react-native';

const Colors = Color()

function SearchBanks({ navigation }) {
    const { User, login, AllBanks, SelectBank, GetAllBanks } = appState()
    const [Search, setSearch] = React.useState("") 

    const [suggestions, setSuggestions] = React.useState([]);

    const handleInputChange = (text) => {
        setSearch(text);
        const filteredSuggestions = AllBanks.filter(
            state => state.name.toLowerCase().includes(text.toLowerCase())
        );
        // setSearch(text);
        setSuggestions(filteredSuggestions);
    };

   

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            GetAllBanks()

        });

        return unsubscribe;

    }, [navigation]);



    return (
        <>


            <SafeAreaView style={{
                backgroundColor: "#fff",
                flex: 1,
            }} >
                <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                    {/* <X color={Colors.primary} size={30} /> */}
                    <BackIcon />
                    <Text fontSize={15} fontWeight="medium">Select Bank</Text>
                </HStack>

                <VStack space={4} >
                    <VStack bg="white" shadow={0.1} marginVertical={0} style={{ padding: 10, height: "100%" }}>

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
                                placeholder='Search Bank Name'
                                size={25} color="red.400" />

                        </HStack>

                        {Search.length < 1 &&
                            <FlatList
                                style={styles.suggestions}
                                data={AllBanks.length > 0 && AllBanks}
                                renderItem={({ item, index }) => (
                                    <Stack>
                                        {/* {console.log(item)} */}
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                SelectBank(item)
                                                navigation.pop()
                                            }}
                                            style={{
                                                // backgroundColor: "#F6F6F6",
                                                marginBottom: 5,
                                                paddingVertical: 10,
                                                paddingRight: 10,
                                                paddingLeft: 20,
                                                width: "100%",
                                                // marginLeft: "5%",
                                                borderRadius: 5,
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }} >
                                            <HStack alignItems="center" space={5} >
                                                {item.logo == "https://nigerianbanks.xyz/logo/default-image.png" ?
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
                                                            uri: item.logo
                                                        }} alt="logo" size="xl" />
                                                }
                                                <BoldText text={item.name} color={Colors.dark} />
                                            </HStack>
                                            <ArrowForward />
                                        </TouchableOpacity>
                                        {AllBanks.length > 1 && <Divider style={{ backgroundColor: Colors.background, height: 0.3 }} />}

                                    </Stack>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        }


                        {Search.length > 0 && suggestions.length > 0 ?
                            <FlatList
                                style={styles.suggestions}
                                data={Search.length > 0 && suggestions}
                                renderItem={({ item, index }) => (
                                    <Stack>
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                SelectBank(item)
                                                navigation.pop()
                                            }}
                                            style={{
                                                // backgroundColor: "#F6F6F6",
                                                marginBottom: 5,
                                                paddingVertical: 10,
                                                paddingRight: 10,
                                                paddingLeft: 20,
                                                width: "100%",
                                                // marginLeft: "5%",
                                                borderRadius: 5,
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }} >
                                            <HStack alignItems="center" space={5} >
                                                {item.logo == "https://nigerianbanks.xyz/logo/default-image.png" ?
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
                                                            uri: item.logo
                                                        }} alt={item.name} size="xl" />}
                                                <BoldText text={item.name} color={Colors.dark} />
                                            </HStack>
                                            <ArrowForward />
                                        </TouchableOpacity>
                                        {AllBanks.length > 1 && <Divider style={{ backgroundColor: Colors.background, height: 0.3 }} />}

                                    </Stack>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            /> : <>
                                {Search.length > 0 && <BoldText style={{ marginBottom: 20, marginLeft: 10 }} text="Search matches no Merchant" />}

                            </>}


                    </VStack>

                </VStack>

            </SafeAreaView> 
        </>
    );
}



export default SearchBanks;


const styles = StyleSheet.create({

    paymentBtns: {

        backgroundColor: Colors.dark,
        // backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 3,
        width: "90%",
        borderWidth: 1,
        height: 55,
    },
    suggestions: {
        marginBottom: 80
    },
    input: { width: '100%', paddingHorizontal: 18, paddingVertical: 16, marginBottom: 10, backgroundColor: "#EAEAEA", borderWidth: 0, borderRadius: 5 },
});
