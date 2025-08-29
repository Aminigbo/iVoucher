import React, { useCallback, useMemo, useState } from 'react';
import { Text, VStack, HStack, Icon, Stack, Center, FlatList } from 'native-base';
import { RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { ArrowForward, BackIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, NumberWithCommas } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { ArrowBigDown, ArrowBigUp, Minus, PlusIcon } from 'lucide-react-native';

import { GetCardDetailsController } from '../auth/controllers';
import { FetchMedicardTransactions } from './service';



const Colors = Color()

function Card({ navigation, }) {
    const [loading, setLoading] = React.useState(false)
    const [CardInfo, setCardInfo] = useState(null)
    const [Transactions, setTransactions] = useState([])

    let { User, login, } = appState()




    function FetchMedicardTransactionsHandler() {
        setLoading(true)
        FetchMedicardTransactions(User.medicard).then(res => {
            if (res.success == true) setTransactions(res.data)
            // console.log(res.data[0].metadata)
            setLoading(false)
        })
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            User.medicard && FetchMedicardTransactionsHandler();
        });

        return unsubscribe;

    }, [navigation]);

    return !User ? navigation.replace("Login") : (
        // return (
        <>
            <SafeAreaView style={{
                display: "flex",
                flex: 1,
            }}>
                <HStack alignItems="center" justifyContent="flex-start" space={5} px={5} py={3} >
                    {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                </TouchableOpacity> */}
                    <Text fontSize="lg" fontWeight="bold" >Medicard activities</Text>
                </HStack>

                <FlatList
                    style={{
                        flex: 1,
                    }}
                    data={[0]}
                    renderItem={() => {
                        return <>
                            {Transactions && Transactions.length < 1 ?
                                <Center style={{
                                    height: 500,
                                }} >
                                    <BoldText text="Recent activities will appear here" color="#000" />
                                </Center>

                                :

                                <VStack space={4} >
                                    <VStack bg="white" shadow={0.1}>
                                        <Stack p={5}>
                                            <HStack style={{
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: 10
                                            }} >
                                                {Transactions && Transactions.length > 5 &&
                                                    <TouchableOpacity onPress={() => navigation.navigate("Notifications")} >
                                                        <HStack justifyContent="flex-end" alignItems="center" space={4} >
                                                            <Text fontWeight={500} color={Colors.primary} >See All</Text>
                                                            <ArrowForward color={Colors.primary} />
                                                        </HStack>
                                                    </TouchableOpacity>
                                                }
                                            </HStack>

                                            {Transactions && Transactions.slice(0, 3).map((items, index) => {
                                                return <TouchableOpacity
                                                    onPress={() => {
                                                        // console.log(items)
                                                        navigation.navigate("view-transaction", { data: items })
                                                    }}
                                                >
                                                    <HStack key={index} alignItems="center" space={3} style={{
                                                        marginTop: 20
                                                    }} >

                                                        <Center style={{
                                                            borderRadius: 30,
                                                            // backgroundColor: items.flow == "IN" ? "#EAFBF5" : "#F9F1F1",
                                                            width: 30,
                                                            height: 30,
                                                        }} >

                                                            {/* {items.flow == "IN" ? */}
                                                            {/* <Icon as={<ArrowBigDown size={19} />} color={Colors.primary} /> : */}
                                                            <Icon as={<ArrowBigUp size={19} />} color={Colors.primary} />
                                                            {/* } */}
                                                        </Center>
                                                        <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                            <VStack  >
                                                                {/* {console.log(items)} */}
                                                                <Text>{items.type}</Text>
                                                                <Text fontWeight="light" fontSize="xs" >{formatDate(items.created_at)}</Text>
                                                            </VStack>

                                                            <HStack alignItems="center" space={0.3} >

                                                                <Text style={{
                                                                    paddingHorizontal: 5,
                                                                    paddingVertical: 1,
                                                                    // this is the end
                                                                    borderRadius: 6,
                                                                    fontSize: 13,
                                                                }} >₦{NumberWithCommas(items.amount)}</Text>
                                                            </HStack>
                                                        </HStack>
                                                    </HStack>

                                                </TouchableOpacity>

                                            })}
                                        </Stack>
                                    </VStack>
                                </VStack>
                            }
                        </>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => {
                            FetchMedicardTransactionsHandler()
                        }} />
                    }
                />

            </SafeAreaView>
            <Loader loading={loading}
            // text={loadingText} 
            />
        </>
    );
}




export default Card;


const styles = StyleSheet.create({

    input: {
        padding: 15,
        marginVertical: 10,
        borderColor: '#ddd', borderBottomWidth: 1, borderRadius: 5, width: "100%",
        color: "#000"
    },

    swiper: {
        height: 150,
    },
    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },

    banner: {
        height: 120,
        backgroundColor: Colors.accent,
        margin: 15,
        position: "relative",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: 20,
    },
    cardButton: {
        backgroundColor: Colors.dark,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    voucherItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        alignItems: "center"
    },

});
