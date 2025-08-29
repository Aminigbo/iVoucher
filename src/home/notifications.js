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

        FetchTransactionsModel(User.uid)
            .then(response => {
                setLoading(false)

                if (response.success == false) {
                    settransaction([])
                } else {
                    settransaction(response.data)
                }
                console.log("response", response)
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
            {/* {console.log(User.uid)} */}


            <SafeAreaView style={{ display: "flex", flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 }} >
                <HStack space={7} alignItems="center" pt={6} p={2}>
                    <BackIcon />
                    <Text fontSize="lg" fontWeight="bold"> Notifications </Text>
                </HStack>


                <FlatList
                    style={{
                        paddingHorizontal: 10,
                    }}
                    data={Transactions}
                    renderItem={({item}) => {
                        return <TouchableOpacity
                            onPress={() => {
                                // navigation.navigate("view-transaction", { data: items })
                            }}
                        >
                            <HStack mt={7} alignItems="center" space={3} >
                                {/* {items.type == "TOKEN-REVERSED" && */}
                                    <Center style={{
                                        // borderWidth: 0.4,
                                        borderRadius: 30,
                                        backgroundColor: "#FEEAEA",
                                        width: 40,
                                        height: 40,
                                    }} >
                                        <Icon as={<TicketX size={20} />} color={Colors.primary} />
                                    </Center>
                                {/* // } */}


                                {/* // : <OutIcon />}  <InIcon /> */}
                                {console.log(item)}
                                <HStack style={{ justifyContent: "space-between", flex: 1 }} >
                                    <VStack  >
                                        {item.data ?

                                            <Text>
                                                {/* {items.message} */}
                                                Transfer {item.user == User.id ? "to " : "from "}
                                                {item.user == User.id ?
                                                    item.data.receiver.accountName.length > 17 ? item.data.receiver.accountName.slice(0, 17) + "..." : item.data.receiver.accountName
                                                    :
                                                    item.data.sender.senderFullname.length > 17 ? item.data.sender.senderFullname.slice(0, 17) + "..." : item.data.sender.senderFullname
                                                }
                                            </Text>
                                            :
                                            <Text>
                                                {item.message}
                                            </Text>
                                        }

                                        <Text fontWeight="light" fontSize="xs" >{formatDate(item.createdAt)}</Text>
                                    </VStack>

                                    {/* <VStack>
                                        <Text fontWeight={700} > ₦{NumberWithCommas(40000)}</Text>
                                        <Text style={{
                                            color: "green",
                                            paddingHorizontal: 5,
                                            paddingVertical: 1,
                                            borderRadius: 6,
                                            fontSize: 13,
                                        }} >{item.status == "success" ? "Success" : "Pending"}</Text>
                                    </VStack> */}
                                </HStack>
                            </HStack>
                        </TouchableOpacity>
                    }}
                    ListEmptyComponent={
                        <Center mt={20} >
                            <EmptyRecord />
                            <BoldText text="No recent notifications" color="lightgrey" style={{ marginTop: 10 }} />
                        </Center>
                    }
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => {
                            handleFetchTransactions()
                        }} />
                    }

                />

            </SafeAreaView>
            {/* <Loader loading={loading} /> */}
        </>
    );
}



export default Notification;
