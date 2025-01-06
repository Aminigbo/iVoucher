import React from 'react';
import { Text, Box, VStack, HStack, Stack, AddIcon, Image, FlatList, Center } from 'native-base';
import { Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { ArrowForward, EmptyRecord, } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Merchant } from '../utilities/data';
import { FetchUserInfoService } from '../auth/service';
import { NumberWithCommas } from '../utilities';
import { appState } from '../state';


const Colors = Color()

function AllMerchants({ navigation }) {
    let { User, login } = appState()
    const [Search, setSearch] = React.useState("")
    const [suggestions, setSuggestions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const handleInputChange = (text) => {
        setSearch(text);
        const filteredSuggestions = Merchant.filter(
            state => state.name.toLowerCase().includes(text.toLowerCase())
        );
        // setSearch(text);
        setSuggestions(filteredSuggestions);
    };


    function FetchUserInfo() {
        setLoading(true)
        FetchUserInfoService(User.id)
            .then(response => {
                setLoading(false)
                if (response.success == false) {
                    Alert.alert("Error", response.message)
                } else {
                    console.log(response.data)
                    login({
                        ...User,
                        ...response.data
                    })
                }
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
            })
    }


    React.useEffect(() => {
        FetchUserInfo()
    }, [])

    // return (
    return !User ? navigation.replace("Login") : (
        <>
            <SafeAreaView style={{ display: "flex", backgroundColor: "#fff", flex: 1 }} >
                <HStack
                    space={7}
                    bg="#fff"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical={18}
                    pt={6}
                    p={2}>
                    <HStack alignItems="center" space={3} >
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                        >
                            Your Merchants
                        </Text>

                    </HStack>
                    <TouchableOpacity onPress={() => navigation.navigate("Merchants")} style={{
                        backgroundColor: Colors.dark,
                        padding: 5,
                        borderRadius: 6,
                        marginRight: 10
                    }} >
                        <AddIcon style={{ color: Colors.white, zIndex: 100 }} />
                    </TouchableOpacity>
                </HStack>

                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <VStack p={4} space={4} mb={20}>

                                <HStack justifyContent="space-between" alignItems="center" p={2} mb={-2} style={{

                                }} >
                                    {User.merchants.length > 0 && <BoldText text="All" color="#000" />}

                                </HStack>

                                <Stack  >
                                    <Box mb={30} >
                                        {
                                            User.merchants.length > 0 ? User.merchants.slice(0, 4).map((items, index) => {
                                                return <HStack alignItems="center" marginVertical={10} >
                                                    <Image
                                                        style={{
                                                            height: 35, width: 35, borderRadius: 40, zIndex: 1000, marginRight: 10
                                                        }}
                                                        source={{
                                                            uri: items.img
                                                        }} alt={items.name} size="xl" />

                                                    <VStack ml={2}>
                                                        <TouchableOpacity onPress={() => {
                                                            navigation.push("Merchant-profile", { data: items })
                                                        }} >
                                                            <Text fontWeight="bold">{items.name}</Text>
                                                            <Text color={Colors.primary}>₦{NumberWithCommas(items.bal)}</Text>
                                                            <HStack alignItems="center" justifyContent="space-between" style={{
                                                                width: "90%"
                                                            }}  >
                                                                <Text color="gray.500"> {items.address.slice(0, 25)}......</Text>

                                                                <ArrowForward />

                                                            </HStack>

                                                        </TouchableOpacity>
                                                    </VStack>

                                                </HStack>

                                            }) : <>

                                                <Center mt={20} >
                                                    <EmptyRecord />
                                                    <HStack alignItems="center" justifyContent="center" mt={4} space={4} >
                                                        <BoldText text="No merchant added" color="#000" style={{}} />

                                                    </HStack>
                                                </Center>


                                            </>
                                        }
                                    </Box>
                                </Stack>


                            </VStack>
                        </>

                    }}

                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => {
                            FetchUserInfo()
                        }} />
                    }

                />

            </SafeAreaView>
        </>
    );
}


export default AllMerchants;