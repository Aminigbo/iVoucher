import React from 'react';
import { Text, VStack, HStack, Stack, Center, FlatList } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon, EmptyRecord, InIcon, OutIcon, } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { BoldText, BoldText1 } from '../global-components/texts';
import { RefreshControl } from 'react-native';

import { formatDate, } from '../utilities';
import { connect } from 'react-redux';
import { Transactions_action, User } from '../redux';
import { FetchTransactionsModel } from '../home/service';
import { appState } from '../state';


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
                        <Text fontSize="lg" fontWeight="bold"> Notification </Text>
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
                                            <BoldText1 text="Recent activities" color="#000" />

                                            {Transactions.map((items, index) => {
                                                return <HStack key={index} mt={7} alignItems="center" space={3} >
                                                    {items.flow == "IN" ? <InIcon /> : <OutIcon />}
                                                    <VStack  >
                                                        <Text>{items.data.message}</Text>
                                                        <Text fontWeight={500} >{formatDate(items.created_at)}</Text>
                                                    </VStack>
                                                </HStack>
                                            })}

                                        </Stack> :
                                        <>
                                            <Center mt={20} >
                                                <EmptyRecord />
                                                <BoldText text="No recent transactions" color="lightgrey" style={{ marginTop: 10 }} />
                                            </Center>
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

        </>
    );
}



export default Notification;
