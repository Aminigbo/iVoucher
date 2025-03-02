import React from 'react';
import { Text, VStack, HStack, Stack, Center, FlatList, Icon } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon, EmptyRecord, InIcon, OutIcon, } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { BoldText, BoldText1 } from '../global-components/texts';
import { RefreshControl, TouchableOpacity } from 'react-native';

import { formatDate, NumberWithCommas, } from '../utilities';
import { connect } from 'react-redux';
import { Transactions_action, User } from '../redux';
import { FetchTransactionsModel } from '../home/service';
import { appState } from '../state';
import { ArrowBigDown, ArrowBigUp, CreditCard, PlusCircleIcon, PlusSquareIcon, TicketCheck, TicketX } from 'lucide-react-native';
import { Loader } from '../global-components/loader';


const Colors = Color()

function Notification({ navigation }) {
    const { User } = appState()
    const [loading, setLoading] = React.useState(false)
    const [Transactions, settransaction] = React.useState([])


    const handleFetchTransactions = () => {
        setLoading(true)

        FetchTransactionsModel(User.id)
            .then(response => {
                setLoading(false)

                if (response.success == false) {
                    settransaction([])
                } else {
                    settransaction(response.data)
                }

            })
            .catch(error => {
                settransaction([])
                setLoading(false)
            })
    }
    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            handleFetchTransactions()

        });

        return unsubscribe;

    }, [navigation]);





    return (

        <>
            {/* {console.log(data)} */}


            <SafeAreaView style={{ display: "flex", flex: 1 }} >

                <HStack alignItems="center" justifyContent="space-between" >
                    <HStack space={7} alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                        <BackIcon />
                        <Text fontSize="lg" fontWeight="bold"> Transactions </Text>
                    </HStack>
                </HStack>


                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <VStack space={4} p={2}>

                                <Stack p={2}>
                                    {Transactions.length > 0 ?
                                        <Stack mt={4} style={{
                                            // backgroundColor:"red", 
                                        }} >
                                            {/* <BoldText1 text="Recent activities" color="#000" /> */}

                                            {Transactions.map((items, index) => {
                                                return <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate("view-transaction", { data: items })
                                                    }}
                                                >
                                                    <HStack key={index} mt={7} alignItems="center" space={3} >

                                                        {items.type == "BANK-PAYOUT" && <Center style={{
                                                            // borderWidth: 0.4,
                                                            borderRadius: 30,
                                                            backgroundColor: "#FEF4EA",
                                                            width: 45,
                                                            height: 45
                                                        }} >
                                                            <Icon as={<ArrowBigUp size={25} />} color={Colors.primary} />
                                                        </Center>}
                                                        {items.type == "MERCHANT-TOPUP" && <Center style={{
                                                            // borderWidth: 0.4,
                                                            borderRadius: 30,
                                                            backgroundColor: "#FEEAFD",
                                                            width: 45,
                                                            height: 45
                                                        }} >
                                                            <Icon as={<PlusCircleIcon size={25} />} color={Colors.primary} />
                                                        </Center>}

                                                        {items.type == "PV-PAYOUT" && <Center style={{
                                                            // borderWidth: 0.4,
                                                            borderRadius: 30,
                                                            backgroundColor: "#EAFBF5",
                                                            width: 45,
                                                            height: 45,
                                                        }} >
                                                            <Icon as={<ArrowBigUp size={25} />} color={Colors.primary} />
                                                        </Center>}

                                                        {items.message == "Merchant top-up" && <Center style={{
                                                            // borderWidth: 0.4,
                                                            borderRadius: 30,
                                                            backgroundColor: "#EAFBF5",
                                                            width: 45,
                                                            height: 45,
                                                        }} >
                                                            <Icon as={<PlusSquareIcon size={25} />} color={Colors.primary} />
                                                        </Center>}

                                                        {items.type == "TOKEN-CREATED" && <Center style={{
                                                            // borderWidth: 0.4,
                                                            borderRadius: 30,
                                                            backgroundColor: "#F2EAFE",
                                                            width: 45,
                                                            height: 45,
                                                        }} >
                                                            <Icon as={<TicketCheck size={25} />} color={Colors.dark} />
                                                        </Center>}

                                                        {items.type == "TOKEN-REVERSED" && <Center style={{
                                                            // borderWidth: 0.4,
                                                            borderRadius: 30,
                                                            backgroundColor: "#FEEAEA",
                                                            width: 45,
                                                            height: 45,
                                                        }} >
                                                            <Icon as={<TicketX size={25} />} color={Colors.primary} />
                                                        </Center>}


                                                        {/* // : <OutIcon />}  <InIcon /> */}

                                                        <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                                            <VStack  >
                                                                <Text>{items.message}</Text>
                                                                <Text fontWeight="light" fontSize="xs" >{formatDate(items.created_at)}</Text>
                                                            </VStack>

                                                            <VStack  >
                                                                <Text fontWeight={700} > ₦{NumberWithCommas(items.amount)}</Text>
                                                                <Text style={{
                                                                    color: items.status == "processing" ? "#E0B77E" : items.status == "success" ? "#7EE0B9" : "#E07E80",
                                                                    paddingHorizontal: 5,
                                                                    paddingVertical: 1,
                                                                    borderRadius: 6,
                                                                    fontSize: 13,
                                                                }} >{items.status}</Text>
                                                            </VStack>
                                                        </HStack>
                                                    </HStack>
                                                </TouchableOpacity>

                                            })}

                                        </Stack> :

                                        <>
                                            {loading == false &&
                                                <Center mt={20} >
                                                    <EmptyRecord />
                                                    <BoldText text="No recent transactions" color="lightgrey" style={{ marginTop: 10 }} />
                                                </Center>
                                            }
                                        </>}
                                </Stack>


                            </VStack>
                        </>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => {
                            handleFetchTransactions()
                        }} />
                    }

                />

            </SafeAreaView>
            <Loader loading={loading} />
        </>
    );
}



export default Notification;
