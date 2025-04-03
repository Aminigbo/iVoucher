import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Text, Input, Image, Pressable, StyleSheet,
    TextInput, TouchableOpacity, View, RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { debounce } from "lodash";
import { Color } from "../global-components/colors";
import { appState } from "../state";
import { BoldText, BoldText1, BoldText2 } from "../global-components/texts";
import { CustomButtons } from "../global-components/buttons";
import { BackIcon } from "../global-components/icons";
import { Actionsheet, Center, Divider, FlatList, HStack, ScrollView, VStack } from "native-base";
import { Slider } from "../assets/svgs";
import { Loader } from "../global-components/loader";

const Colors = Color();

const PocketVoucherTransfer = ({ navigation }) => {
    const { Transactions, Loading, AllUsers, InitiatePayout, GetAllUsers, User, GetAllTransactions } = appState();
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState(0);
    const [accountHolder, setAccountHolder] = useState(null);
    const [enterAmountPop, setEnterAmountPop] = useState(false);
    const [remark, setRemark] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    // Memoized unique transactions
    const uniqueTransactions = useMemo(() =>
        Transactions.filter(e => e.type === "PV-PAYOUT")
            .reduce((acc, current) => {
                if (!acc.find(item => item.data.receiver.account === current.data.receiver.account)) {
                    acc.push(current);
                }
                return acc;
            }, []),
        [Transactions]
    );

    // Debounced input handler
    // const handleInputChange = useCallback(debounce(text => {
    //     // console.log(text)
    //     const filtered = AllUsers.filter(
    //         state => state.phone.slice(-10) === text
    //     );
    //     setSuggestions(filtered);
    // }, 300), []);

    const handleInputChange = (text) => {
        setAccountNumber(text);
        const filteredSuggestions = AllUsers.filter(
            state => state.phone.toLowerCase() == text.toLowerCase()
        );
        // console.log(filteredSuggestions);
        setSuggestions(filteredSuggestions);
    };


    // Optimized data fetching
    useEffect(() => {
        const fetchData = async () => {
            if (!Transactions.length) await GetAllTransactions();
            if (!AllUsers.length) await GetAllUsers();
        };

        const unsubscribe = navigation.addListener('focus', fetchData);
        return unsubscribe;
    }, []);

    // Optimized suggestion renderer
    const renderSuggestion = useCallback(({ item }) => (
        // item.phone.slice(-10) !== User.phone && (
        <TouchableOpacity
            onPress={() => {
                setEnterAmountPop(true);
                setAccountHolder({
                    AccountNumber: item.phone.slice(-10),
                    account_name: `${item.firstName} ${item.lastName}`,
                    id: item.userID,
                });
            }}
            style={styles.suggestionItem}
        >
            <Text fontWeight="medium">{`${item.firstName} ${item.lastName}`}</Text>
            <Text color="gray.400">Pocket Voucher - {item.phone.slice(-10)}</Text>
        </TouchableOpacity>
        // )
    ), [User]);

    return (<>
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackIcon />
                <Text style={styles.headerTitle}>Transfer to Pocket Voucher</Text>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            GetAllTransactions();
                            GetAllUsers();
                        }}
                    />
                }
            >

                <Center>
                    <Slider />
                </Center>


                <View style={styles.inputContainer}>
                    <Text style={{ fontWeight: "bold" }}>Recipient Account</Text>
                    <TextInput
                        style={styles.input}
                        // onChangeText={text => {
                        //     setAccountNumber(text);
                        //     handleInputChange(text);
                        // }}
                        onChangeText={handleInputChange}
                        value={accountNumber}
                        placeholder="Phone Number"
                        placeholderTextColor="grey"
                        keyboardType="phone-pad"
                    />
                    <Text style={{ color: "#459978", fontWeight: "light" }}>Free, Fast, & Easy</Text>
                </View>

                {/* Virtualized Suggestions */}
                <FlatList
                    data={suggestions}
                    renderItem={renderSuggestion}
                    keyExtractor={item => item.userID}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    ListEmptyComponent={null}
                />

                {/* Conditional Recent Transactions */}
                {uniqueTransactions.length > 0 && (
                    <View style={styles.recentTransactions}>
                        <Text style={{ fontWeight: "bold", fontSize: 15, marginBottom: 10 }}>Recents</Text>
                        <Divider style={{ marginVertical: 10, height: 0.5, backgroundColor: "#E6E6E6" }} />
                        <FlatList
                            data={uniqueTransactions}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setEnterAmountPop(true);
                                        setAccountHolder({
                                            AccountNumber: item.data.receiver.account,
                                            account_name: item.data.receiver.name,
                                            id: item.to,
                                        });
                                    }}
                                    style={styles.transactionItem}
                                >
                                    {console.log(item.data)}
                                    <Text style={{ fontWeight: "bold" }}>{item.data.receiver.accountName}</Text>
                                    <Text style={{ color: "gray" }}>
                                        {item.data.receiver.account} - {item.data.receiver.bank_name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id}
                            initialNumToRender={3}
                        />
                    </View>
                )}
            </ScrollView>

            {/* Lazy-loaded ActionSheet */}
            {enterAmountPop && (
                <ActionSheet
                    accountHolder={accountHolder}
                    amount={amount}
                    setAmount={setAmount}
                    remark={remark}
                    setRemark={setRemark}
                    onClose={() => setEnterAmountPop(false)}
                    navigation={navigation}
                    InitiatePayout={InitiatePayout}
                    setSuggestions={setSuggestions}
                    setAccountNumber={setAccountNumber}
                />
            )}


        </SafeAreaView>
        {Loading && <Loader loading={true} />}

    </>
    );
};


// Extracted ActionSheet component for lazy loading
const ActionSheet = React.memo(({
    accountHolder, amount, setAmount, remark, setRemark,
    onClose, navigation, InitiatePayout, setSuggestions, setAccountNumber
}) => (
    <Actionsheet isOpen={true} onClose={onClose}>
        <Actionsheet.Content>
            {accountHolder &&
                <>
                    <HStack mb={15} alignItems="center" space={5} justifyContent="flex-start" mt={2}
                        style={{ width: "95%", backgroundColor: "#E6E6E6", padding: 15, borderRadius: 10 }} >

                        <VStack>
                            <BoldText1 text={accountHolder.account_name} color="#000" size={16} />
                            <Text color="gray.500">{`${accountHolder.AccountNumber}`}</Text>
                        </VStack>
                    </HStack>


                    <View style={[{ padding: 15, width: "100%", marginTop: 20 }, styles.shadowBox]}>
                        <BoldText text={`Amount`} color="#000" />
                        <HStack space={3} style={{
                            marginTop: 25,
                            alignItems: "center",
                        }} >
                            <BoldText2 text="₦" color="#000" />
                            <TextInput
                                style={[{ fontSize: 20, fontWeight: 500, color: "#000", width: "95%", padding: 10 }]}
                                placeholder="500.00 - 1,000,000.00"
                                onChangeText={setAmount}
                                value={amount}
                                keyboardType='numeric'
                                placeholderTextColor="grey"
                            />
                        </HStack>
                        <Divider />
                        <HStack mt={4} justifyContent="space-between" paddingVertical={10} >
                            <TouchableOpacity onPress={() => setAmount("500")} >
                                <Text style={styles.pills} >₦500.00</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setAmount("1000")}>
                                <Text style={styles.pills} >₦1,000.00</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setAmount("5000")}>
                                <Text style={styles.pills} >₦5,000.00</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setAmount("10000")}>
                                <Text style={styles.pills} >₦10,000.00</Text>
                            </TouchableOpacity>
                        </HStack>

                    </View>


                    <View style={[{ padding: 15, width: "100%", marginTop: 20 }, styles.shadowBox]}>
                        <BoldText text={`Remark`} color="#000" />
                        <TextInput style={[{ fontSize: 15, fontWeight: 300, color: "#000", marginTop: 25, }]}
                            placeholder="What's the payment for?(optional)"
                            placeholderTextColor="grey"
                            onChangeText={setRemark} value={remark} />
                    </View>

                    <CustomButtons
                        callBack={() => {
                            if (amount > 99) {
                                onClose(false)
                                setSuggestions([])
                                setAccountNumber("")
                                setRemark("")
                                setAmount(0)
                                InitiatePayout({
                                    payoutType: "pocket_voucher",
                                    amount: amount,
                                    naration: remark,
                                    receiver: {
                                        number: accountHolder.AccountNumber,
                                        name: accountHolder.account_name,
                                        id: accountHolder.id,
                                    },
                                    navigation
                                })
                            }
                        }}
                        primary={amount > 99 && true}
                        opacity={amount < 100 ? 0.2 : 1}
                        text="Make payment"
                    />

                </>
            }
        </Actionsheet.Content>
    </Actionsheet>
));


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        display: "flex"
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.white
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16
    },
    banner: {
        width: '90%',
        height: 100,
        alignSelf: 'center',
        borderRadius: 8,
        marginVertical: 16
    },
    inputContainer: {
        padding: 15,
        margin: 15,
        marginTop: 25,
        borderRadius: 10,
        backgroundColor: '#fff',

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.3,
        shadowRadius: 0.5,
        borderRadius: 6,

        // // Shadow for Android
        elevation: 0.4,
    },
    input: {
        borderWidth: 0.4,
        padding: 12,
        borderColor: 'grey',
        borderRadius: 8,
        marginVertical: 20
    },
    suggestionItem: {
        backgroundColor: '#F6F6F6',
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8
    },
    recentTransactions: {
        padding: 16,
        margin: 16,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.3,
        shadowRadius: 0.5,
        borderRadius: 6,
    },
    transactionItem: {
        paddingVertical: 12
    },
    pills: {
        borderColor: "#E6E6E6",
        textAlign: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 0.5
    }
});

export default PocketVoucherTransfer;