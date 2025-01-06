import React, { useEffect, useState } from 'react';
import { Text, Box, IconButton, VStack, HStack, Icon, Button, ScrollView, Stack, Divider, AddIcon, Image, Center, FlatList, Overlay, Actionsheet, CheckCircleIcon } from 'native-base';
import { ActivityIndicator, Alert, AppState, PermissionsAndroid, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BoldText, BoldText1, BoldText2 } from '../global-components/texts';
import { AcceptanceIcon, ArrowForward, CopyIcon, EmptyRecord, Eye, FastIcon, HelpCenterIcon, InIcon, MerchantIcon, NotificationIcon, OutIcon, RefeeralIcon, ScanIcon, SecureIcon, SendVoucherIcon, ScanQRIcon, VoucherIcon, CloseIcon, DeleteIcon, BiometricIcon } from '../global-components/icons';
import VoucherComponent from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Merchant } from '../utilities/data';
// import { Transactions_action, User } from '../redux';
import { connect } from 'react-redux';
import { CreatePinController, FetchTransactionsModel, GetAppConfigService } from './service';
import { formatDate, NumberWithCommas } from '../utilities';
import ShareLib from 'react-native-share';
import { FetchUserInfoService } from '../auth/service';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { LinkButtons } from '../global-components/buttons';

const Colors = Color()

function Home({ navigation, disp_transactions, }) {

    const [inputs, setInputs] = useState(['', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false);

    const [seeBal, setseeBal] = React.useState(true)
    const [AppConfigs, setAppConfigs] = React.useState(null)
    const [loadAll, setloadAll] = React.useState(false)
    const [Overlay, setOverlay] = React.useState(false)
    const [app_State, setApp_State] = useState(AppState.currentState);
    const [loading, setLoading] = React.useState({
        transactions: false,
        pin: false
    })

    let { User, Transactions, login, SaveTrxn } = appState()


    const requestNotificationPermission = async () => {
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Blake',
                        message:
                            'Blake needs access to ' +
                            'send you notification',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // navigation.navigate("Scan", { user: User.id })
                } else {
                    Alert.alert("Permision Error", "You need to allow us access to your camera")
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            // navigation.replace("Login")
        }
    };

    const handleFetchTransactions = () => {
        setLoading({
            ...loading,
            transactions: true
        })

        FetchTransactionsModel(User.id)
            .then(response => {
                setLoading({
                    ...loading,
                    transactions: false
                })

                if (response.success == false) {
                    SaveTrxn([])
                } else {
                    SaveTrxn(response.data)
                }

            })
            .catch(error => {
                disp_transactions([])
                setLoading({
                    ...loading,
                    transactions: false
                })
            })
    }


    const handleFetchAppConfig = () => {
        GetAppConfigService()
            .then(response => {

                if (response.success == false) {
                    setAppConfigs(null)
                } else {
                    setAppConfigs(response.data)
                }

            })
            .catch(error => {
                setAppConfigs(null)
            })
    }


    function FetchUserInfo() {
        FetchUserInfoService(User.id)
            .then(response => {
                if (response.success == false) {
                    Alert.alert("Error", response.message)
                } else {
                    login({
                        ...User,
                        ...response.data
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }


    // React.useEffect(() => {
    //     handleFetchTransactions()
    //     handleFetchAppConfig()
    //     FetchUserInfo()
    // }, [])


    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            handleFetchTransactions()
            handleFetchAppConfig()
            FetchUserInfo()

        });

        return unsubscribe;

    }, [navigation]);



    const totalAmount = User ? User.merchants.reduce((sum, item) => sum + item.bal, 0) : "";


    const onShareToken = async () => {
        if (!AppConfigs) {
            handleFetchAppConfig()
        } else {
            try {
                await ShareLib.open({
                    message: `Follow the link ${Platform.OS == "android" ? AppConfigs.playStoreLink : AppConfigs.appStoreLink} to download the Pocket Voucher app. Use my referral code ${"User.reffCode"} to register and win a free shoping voucher`,
                    url: `Follow the link ${Platform.OS == "android" ? AppConfigs.playStoreLink : AppConfigs.appStoreLink} to download the Pocket Voucher app. Use my referral code ${"User.reffCode"} to register and win a free shoping voucher`,
                });
            } catch (error) {

            }

        }

    };



    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            // If the app transitions from active to background, lock the app
            if (app_State.match(/active/) && nextAppState === 'background') {
                // show overlay
                setOverlay(true)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Biometrics' }], // Redirect to Login screen
                });
            }

            // Update the app state
            setApp_State(nextAppState);
        };

        // Add the listener for app state changes
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Cleanup the listener when the component unmounts
        return () => {
            subscription.remove();
        };
    }, [app_State, navigation]);


    const handleKeyPress = (key) => {
        if (key === 'Del') {
            setError(false)
            if (currentIndex > 0) {
                const updatedInputs = [...inputs];
                updatedInputs[currentIndex - 1] = '';
                setInputs(updatedInputs);
                setCurrentIndex(currentIndex - 1);
            }
        } else if (key === "Done") {
            const updatedInputs = [...inputs];
            let inputedPin = updatedInputs.join('');
            console.log(inputedPin)
            ConfigSafePin(inputedPin)

        } else if (currentIndex < 4) {
            const updatedInputs = [...inputs];
            updatedInputs[currentIndex] = key;
            setInputs(updatedInputs);
            setCurrentIndex(currentIndex + 1);
        }
    };


    function ConfigSafePin(key) {
        setLoading({
            ...loading,
            pin: true
        })
        CreatePinController({ user: User.id, pin: key })
            .then(response => {
                setLoading({
                    ...loading,
                    pin: false
                })

                if (response.success == false) {
                    return console.log(error)
                }

                login({
                    ...User,
                    ...response.data
                })
                requestNotificationPermission()

            })
            .catch(error => {
                setLoading({
                    ...loading,
                    pin: false
                })
                console.log(error)
            })
    }


    return !User ? navigation.replace("Login") : (
        // return (
        <>
            <SafeAreaView style={{
                backgroundColor: Colors.white, display: "flex", flex: 1,
            }} >
                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <HStack alignItems="center" justifyContent="space-between" paddingVertical={18} pt={6} pb={4} p={2} >
                                <Text fontSize="lg" fontWeight="bold">{User && User.name.split(" ")[0]}</Text>
                                <HStack space={7}>
                                    <TouchableOpacity onPress={() => { navigation.navigate("Support", { user: User.id }) }} >
                                        <HelpCenterIcon />
                                    </TouchableOpacity >
                                    <TouchableOpacity onPress={() => {

                                        navigation.navigate("Notifications")
                                    }}>
                                        <NotificationIcon />
                                    </TouchableOpacity>
                                </HStack>
                            </HStack>
                            <VStack space={4} mb={4}>
                                <VoucherComponent
                                    User={User}
                                    totalAmount={totalAmount}
                                    seeBal={seeBal}
                                    setseeBal={setseeBal}
                                />
                                {/* Quick Action Buttons */}
                                <VStack bg="white" shadow={0.1} marginVertical={0}>
                                    <HStack bg="white" space={4} alignItems="center" p={4} justifyContent="space-around" >
                                        <TouchableOpacity onPress={() => navigation.navigate("Merchants")} >
                                            <VStack alignItems="center" space={2}>
                                                <MerchantIcon />
                                                <Text>Merchant</Text>
                                            </VStack>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={onShareToken}>
                                            <VStack alignItems="center" space={2}>
                                                <SendVoucherIcon />
                                                <Text>Refer & Earn</Text>
                                            </VStack>

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("Scan", { user: User.id })
                                            // requestNotificationPermission()
                                        }} >
                                            <VStack alignItems="center" space={2}>
                                                <ScanQRIcon />
                                                <Text>Scan Code</Text>
                                            </VStack>
                                        </TouchableOpacity>
                                    </HStack>


                                    <HStack
                                        space={5}
                                        style={{
                                            height: 120,
                                            backgroundColor: "#E6E6E6",
                                            margin: 15,
                                            position: "relative",
                                            borderRadius: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: 15,
                                            // opacity: 0.3, 
                                        }} >
                                        <VStack
                                            space={3}
                                            style={{
                                                flex: 2,
                                                justifyContent: "flex-start",
                                                alignItems: "flex-start",
                                            }}>
                                            <BoldText2
                                                color={Colors.dark}
                                                size={16}
                                                text="You’ll get 2% voucher token when you refeer a friend to use iVoucher"
                                            />
                                            <LinkButtons
                                                callBack={onShareToken}
                                                text="Refeer" />
                                        </VStack>

                                        <Center flex={1} style={{ marginTop: 20 }} >
                                            <RefeeralIcon />
                                        </Center>
                                    </HStack>



                                    {User && User.merchants.length < 1 ? <>

                                        <Center mt={20} >
                                            <EmptyRecord />
                                            <HStack alignItems="center" justifyContent="center" mt={4} space={4} >
                                                <BoldText text="No merchant added" color="#000" style={{}} />
                                                <TouchableOpacity onPress={() => navigation.navigate("Merchants")} style={{
                                                    backgroundColor: "#EA4B45",
                                                    padding: 5,
                                                    opacity: 0.6,
                                                    borderRadius: 6,
                                                }} >
                                                    <AddIcon style={{ color: Colors.dark, zIndex: 100 }} />
                                                </TouchableOpacity>
                                            </HStack>
                                        </Center>


                                    </> : <>
                                        {/* <Divider marginVertical={15} /> */}
                                        <HStack justifyContent="space-between" alignItems="center" p={2} mb={-2} style={{ paddingLeft: 20, marginTop: 20 }} >
                                            <BoldText text="Your Merchants" color="#000" />
                                        </HStack>

                                        <Stack p={2}  >
                                            <Box mb={11}  >
                                                {
                                                    // console.log(User.merchants.length)

                                                    User && User.merchants.slice(0, 4).map((items, index) => {
                                                        return <HStack alignItems="center" mt={6}  >
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
                                                                    // console.log(items)
                                                                }} >
                                                                    <Text fontWeight="bold">{items.name}</Text>
                                                                    <Text color={Colors.primary}>₦{NumberWithCommas(items.bal)}</Text>
                                                                    <HStack alignItems="center" justifyContent="space-between" style={{
                                                                        // backgroundColor: "red",
                                                                        width: "90%"
                                                                    }}  >
                                                                        <Text color="gray.500"> {items.address.slice(0, 25)}......</Text>

                                                                        <ArrowForward />

                                                                    </HStack>

                                                                </TouchableOpacity>
                                                            </VStack>
                                                        </HStack>

                                                    })
                                                }
                                            </Box>
                                        </Stack>
                                    </>}

                                    {Transactions && Transactions.length > 0 && <Divider style={{ opacity: 0.4 }} />}

                                    <Stack p={5}  >

                                        <HStack style={{
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 10
                                        }} >
                                            {Transactions && Transactions.length > 0 && <BoldText text="Recent activities" color="#000" />}

                                            {Transactions && Transactions.length > 2 &&
                                                <TouchableOpacity onPress={() => navigation.navigate("Notifications")} >
                                                    <HStack justifyContent="flex-end" alignItems="center" space={4} >
                                                        <Text fontWeight={500} color={Colors.primary} >See All</Text>
                                                        <ArrowForward color={Colors.primary} />
                                                    </HStack>
                                                </TouchableOpacity>
                                            }

                                        </HStack>



                                        {Transactions && Transactions.slice(0, 3).map((items, index) => {
                                            return <HStack key={index} mt={6} alignItems="center" space={3} >
                                                {items.flow == "IN" ? <InIcon /> : <OutIcon />}
                                                <VStack  >
                                                    <Text>{items.data.message}</Text>
                                                    <Text fontWeight={500} >{formatDate(items.created_at)}</Text>
                                                </VStack>
                                            </HStack>
                                        })}

                                    </Stack>

                                    {/* </>} */}


                                </VStack>
                            </VStack>

                        </>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={loadAll} onRefresh={() => {
                            handleFetchAppConfig()
                            handleFetchTransactions()
                            FetchUserInfo()
                        }} />
                    }
                />

            </SafeAreaView>

            {Overlay && <Stack style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 100
            }} />}


            <Actionsheet isOpen={User.pin ? false : true} onClose={() => {
                // setbottomSheet(!bottomSheet)
            }}>
                <Actionsheet.Content>

                    {loading.pin && <Stack style={{
                        position: "absolute",
                        height: "110%",
                        width: "110%",
                        top: 0,
                        left: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        zIndex: 1
                    }} />}


                    <BoldText text="Create a secured pin" color={Colors.primary} style={{ padding: 10 }} />

                    {/* Input Boxes */}
                    <View style={styles.inputContainer}>
                        {inputs.map((input, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.inputBox,
                                    currentIndex === index && styles.activeInputBox,
                                    {
                                        borderColor: error && Colors.primary,
                                        backgroundColor: input ? '#000' : '#fff'
                                    }
                                ]}
                            >
                                {/* <Text style={styles.inputText}>{input ? '●' : ''}</Text> */}
                            </View>
                        ))}
                    </View>

                    {/* Custom Keyboard */}
                    <View style={styles.keysContainer}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Del', 0, 'Done'].map((key, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.keyButton,
                                    key === 'Del' && styles.deleteKey,
                                ]}
                                onPress={() => handleKeyPress(key)}
                            >
                                <Text style={styles.keyText}>
                                    {key === 'Done' ? <>
                                        {loading.pin ? <ActivityIndicator /> : <CheckCircleIcon size={25} color={Colors.primary} />}
                                    </> : key === 'Del' ? "⌫" : key}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </Actionsheet.Content>
            </Actionsheet>




        </>
    );
}




export default Home;


const styles = StyleSheet.create({

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 50
    },
    inputBox: {
        width: 15,
        height: 15,
        marginHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    activeInputBox: {
        borderColor: '#007BFF',
    },
    inputText: {
        fontSize: 24,
        color: '#000',
    },
    keysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    keyButton: {
        width: '30%',
        height: 90,
        // aspectRatio: 1,
        // padding: '2%',
        // backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 8,
        // borderWidth: 0.3,
        // borderColor: '#ddd',
    },
    deleteKey: {
        // backgroundColor: '#ffcccc',
    },
    keyText: {
        fontSize: 20,
        color: '#000',
    },
    sendButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

});
