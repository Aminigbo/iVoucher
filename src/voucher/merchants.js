import React from 'react';
import { Text, Box, VStack, HStack, Icon, Button, ScrollView, Stack, Actionsheet, Center, Image, ArrowForwardIcon, Divider, FlatList, ShareIcon, WarningOutlineIcon } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon, CloseIcon, CopyIcon, CreateToken, DeleteIcon, EmptyRecord, HeartIcon, InIcon, LogoutIcon, OutIcon, QRcodeIcon, ResolveTokenIcon, ScanQRIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { BoldText, BoldText1 } from '../global-components/texts';
import { ActivityIndicator, Alert, ImageBackground, PermissionsAndroid, RefreshControl, Share, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { formatDate, NumberWithCommas } from '../utilities'; 
import { FetchTransactionsModel } from '../home/service';
import { DeactivateTokenService, FetchActiveTokenService, RemoveMerchantService } from './services';
import { FetchUserInfoService } from '../auth/service';
import { captureRef } from 'react-native-view-shot';
import ShareLib from 'react-native-share';
import RNFS from 'react-native-fs';
import { Loader } from '../global-components/loader';
import { appState } from '../state';


const Colors = Color()

function Merchantprofile({ navigation, route, }) {
    let { User, login } = appState()
    const [bottomSheet, setbottomSheet] = React.useState(false)
    const [bottomSheetAction, setbottomSheetAction] = React.useState(null)
    const [data, setData] = React.useState(route.params.data)
    const [ActiveTokens, setActiveTokens] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [Transactions, settransaction] = React.useState([])
    const [SingleToken, setSingleToken] = React.useState(null)
    const [balLoading, setbalLoading] = React.useState(false)
    const [heavyLoading, setheavyLoading] = React.useState(false)


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

    const handleFetchActiveToken = () => {
        setLoading(true)

        FetchActiveTokenService({
            user: User.id,
            walletAdress: data.address
        })
            .then(response => {
                setLoading(false)

                if (response.success == false) {
                    setActiveTokens([])
                } else {
                    setActiveTokens(response.data)
                }

            })
            .catch(error => {
                setActiveTokens([])
                setLoading(false)
            })
    }

    const copyToClipboard = (text) => {
        console.log(typeof text)
    };

    function FetchUserInfo() {
        setbalLoading(true)
        FetchUserInfoService(User.id)
            .then(response => {
                if (response.success == false) {
                    Alert.alert("Error", response.message)
                } else {
                    login({
                        ...User,
                        ...response.data
                    })
                    let actualMerchant = response.data.merchants.filter(e => e.id == data.id)[0]
                    setData(actualMerchant)
                }
                setbalLoading(false)
            })
            .catch(error => {
                console.log(error)
                setbalLoading(false)
            })
    }


    const handleDeactivateToken = (token) => {
        setheavyLoading(true)

        DeactivateTokenService(token)
            .then(response => {
                setheavyLoading(false)

                if (response.success == false) {
                    Alert.alert("Error", response.message)
                } else {
                    login({
                        ...User,
                        merchants: response.data.merchants
                    })
                    handleFetchActiveToken()
                    FetchUserInfo()
                    handleFetchTransactions()
                }

            })
            .catch(error => {
                Alert.alert("Error", "A network error occured")
                setheavyLoading(false)
            })
    }


    React.useEffect(() => {
        handleFetchTransactions()
        handleFetchActiveToken()
        FetchUserInfo()
    }, [])


    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            handleFetchTransactions()
            handleFetchActiveToken()
            FetchUserInfo()

        });

        return unsubscribe;

    }, [navigation]);


    // const onShare = async () => {
    //     // console.log(User.reffCode)
    //     try {
    //         const result = await Share.share({
    //             message: data.address
    //         });
    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 // shared with activity type of result.activityType
    //             } else {
    //                 // shared
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             // dismissed
    //         }
    //     } catch (error) {
    //         Alert.alert(error.message);
    //     }
    // };

    const qrCodeRef = React.useRef();

    const onShare = async () => {
        try {
            // Capture the QR code view
            const uri = await captureRef(qrCodeRef, {
                format: 'png',
                quality: 0.8,
            });

            console.log(uri)
            // Share the captured image
            await ShareLib.open({
                url: uri,
                message: "Here's my QR code",
            });
            // Delete the image from cache after sharing
            await RNFS.unlink(uri);
            console.log("Image deleted from cache");
        } catch (error) {
            // Delete the image from cache after sharing
            await RNFS.unlink(uri);
            console.log("Image deleted from cache");
            Alert.alert("Error", error.message);
        }
    };


    const onShareToken = async (token) => {
        try {
            await ShareLib.open({
                message: token,
            });
        } catch (error) {
            console.log("Image deleted from cache");
        }
    };


    function handleRemoveMerchant() {
        setheavyLoading(true)

        RemoveMerchantService(User.id, data.id, data.address)
            .then(response => {
                if (response.success == false) {
                    setheavyLoading(false)
                    Alert.alert("Error", response.message)
                } else {

                    login({
                        ...User,
                        merchants: response.data.merchants
                    })
                    Alert.alert("Success", response.message, [
                        {
                            onPress: () => {
                                navigation.pop()
                            }
                        }
                    ])
                }
            })
            .catch(error => {
                setheavyLoading(false)
            })
    }


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
                    navigation.navigate("Scan", { user: User.id })
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

    // return (
    return !User ? navigation.replace("Login") : (

        <>
            {/* {console.log(data)} */}


            <SafeAreaView style={{ display: "flex", flex: 1 }} >

                <HStack alignItems="center" justifyContent="space-between" >
                    <HStack space={7} bg="#fff" alignItems="center" paddingVertical={18} pt={6} pb={6} p={2}>
                        <BackIcon />
                        <Text fontSize="lg" fontWeight="bold"> {data.name} </Text>
                    </HStack>
                    <TouchableOpacity onPress={() => {
                        setbottomSheet(!bottomSheet);
                        setbottomSheetAction("ACCOUNT OPTIONS")
                    }} >
                        <Image
                            style={{
                                height: 35, width: 35, borderRadius: 40, zIndex: 1000, marginRight: 10
                            }}
                            source={{
                                uri: data.img
                            }} alt={data.name} size="xl" />

                    </TouchableOpacity>
                </HStack>


                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>
                            <VStack space={4} p={2}>

                                {/* Balance Card */}

                                <Box style={{
                                    position: "relative",
                                }} bg={Colors.dark} p={4} borderRadius="lg">
                                    <HStack justifyContent="space-between" alignItems="center">
                                        <VStack>
                                            <Text color="white" fontSize="lg" fontWeight="bold">
                                                {balLoading == true ? <ActivityIndicator size={10} color="#fff" /> : <> ₦{NumberWithCommas(data.bal)}</>}
                                            </Text>
                                        </VStack>
                                        <Button bg="white" size="sm" variant="outline"
                                            onPress={() => {
                                                navigation.navigate("Topup", { data,User })
                                            }}
                                            colorScheme={Colors.primary} borderRadius="full">
                                            + Add Money
                                        </Button>
                                    </HStack>
                                    <Text mt={2} color="white" fontSize="xs">Available Balance</Text>

                                    <Stack style={{
                                        height: 80,
                                        width: 130,
                                        borderRadius: 130,
                                        backgroundColor: Colors.primary,
                                        opacity: 0.2,
                                        position: "absolute",
                                        top: 10,
                                        left: 30
                                    }} />
                                    <Stack style={{
                                        height: 30,
                                        width: 30,
                                        borderRadius: 130,
                                        backgroundColor: Colors.primary,
                                        opacity: 0.2,
                                        position: "absolute",
                                        bottom:0,
                                        right: 30
                                    }} />
                                </Box>


                                <VStack bg="white" shadow={0.9} marginTop={3}>
                                    <HStack bg="white" space={4} alignItems="center" paddingVertical={10} justifyContent="space-around" >
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("resolve-token", { data })
                                        }} >
                                            <VStack alignItems="center" space={1}>
                                                <ResolveTokenIcon />
                                                <Text style={{ fontSize: 12, color: "grey" }} >Resolve code</Text>
                                            </VStack>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            navigation.push("create-token", { data })
                                        }} >
                                            <VStack alignItems="center" space={1}>
                                                <CreateToken />
                                                <Text style={{ fontSize: 12, color: "grey" }} >Create code</Text>
                                            </VStack>

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { 
                                            requestNotificationPermission()
                                        }
                                        } >
                                            <VStack alignItems="center" space={1}>
                                                <ScanQRIcon />
                                                <Text style={{ fontSize: 12, color: "grey" }} >Scan & Send</Text>
                                            </VStack>
                                        </TouchableOpacity>
                                    </HStack>
                                </VStack>
                                
                                 <TouchableOpacity>
                                    <HStack alignItems="center" justifyContent="space-between" style={{
                                        borderColor: "lightgrey",
                                        borderWidth: 0.4,
                                        width: "100%",
                                        paddingVertical: 17,
                                        textAlign: "center",
                                        borderRadius: 4,
                                        overflow: "scroll",
                                        position: "relative",
                                    }}  >
                                        <Text color="gray.400"  > {data.address} </Text> 
                                    </HStack>
                                </TouchableOpacity>



                                {/* Active token */}
                                {ActiveTokens && ActiveTokens.length > 0 &&
                                    <VStack bg="white" shadow={1} marginVertical={0}   >
                                        <Stack p={2} >
                                            <Text style={{ fontSize: 12, color: "grey" }} >Active tokens</Text>
                                            {ActiveTokens && ActiveTokens.map((items, index) => {
                                                return <HStack alignItems="center" justifyContent="space-between" style={{
                                                    width: "100%",
                                                    padding: 4,
                                                    textAlign: "center",
                                                    borderRadius: 4,
                                                    marginTop: 4,
                                                }}  >
                                                    <VStack>
                                                        <BoldText1 color={Colors.dark} text={items.token} />
                                                        <Text fontSize={11} color="green.500" >● ₦{NumberWithCommas(items.amount)} </Text>
                                                    </VStack>

                                                    <HStack space={12}>
                                                        <TouchableOpacity onPress={() => {
                                                            onShareToken(items.token)
                                                        }} >
                                                            <ShareIcon color="red.400" />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => {
                                                            setbottomSheet(!bottomSheet);
                                                            setbottomSheetAction("REVERSE TOKEN")
                                                            setSingleToken(items)
                                                        }}  >
                                                            <CloseIcon />
                                                        </TouchableOpacity>
                                                    </HStack>
                                                </HStack>
                                            })}

                                        </Stack>
                                    </VStack>
                                }


                                <Stack p={2}>
                                    {Transactions.filter(e => e.data.address == data.address).length > 0 ?
                                        <Stack mt={4} >
                                            <BoldText1 text="Recent activities" color="#000" />

                                            {Transactions.filter(e => e.data.address == data.address).map((items, index) => {
                                                return <HStack key={index} mt={4} alignItems="center" space={3} >
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
                            handleFetchActiveToken()
                            FetchUserInfo()
                        }} />
                    }

                />

            </SafeAreaView>

            {heavyLoading == true && <Loader loading={heavyLoading} />}

            <Actionsheet isOpen={bottomSheet} onClose={() => {
                setbottomSheet(!bottomSheet)
            }}>
                <Actionsheet.Content>

                    {bottomSheetAction == "ACCOUNT OPTIONS" && <>
                        <BoldText text="Account ptions" color="lightgrey" style={{ marginTop: 10 }} />
                        <Stack style={{
                            width: "100%",
                            padding: 15
                        }} >

                            <TouchableOpacity ref={qrCodeRef}
                                style={{
                                    alignItems: 'center',
                                    marginTop: 10, paddingVertical: 50,
                                    backgroundColor: "#fff"
                                }}>
                                <QRCode
                                    value={`${User.id}@./.@${data.address}@./.@${data.id}`}
                                    logo={{ uri: data.img }}
                                    logoSize={30}
                                    size={200}
                                    logoBackgroundColor="transparent"
                                />
                            </TouchableOpacity>
                            {/* <BoldText text={`${User.id}@./.@${data.address}@./.@${data.id}`} color="lightgrey" style={{ marginTop: 10, paddingHorizontal: 40, marginBottom: 40 }} /> */}


                            <TouchableOpacity onPress={() => {
                                onShare()
                                setbottomSheet(!bottomSheet)
                            }}   >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4} alignItems="center"  >
                                        <ShareIcon style={{ color: Colors.primary }} />
                                        <VStack>
                                            <BoldText1 text="Share merchant address" color={Colors.dark} />
                                            <BoldText text="Your friends can fun this merchant for you" color="grey" />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>

                            <Divider marginVertical={16} bgColor="gray.200" />

                            <TouchableOpacity onPress={() => {
                                setbottomSheet(!bottomSheet)
                                navigation.navigate('Support', { user: User.id })
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4} alignItems="center" >
                                        <WarningOutlineIcon color={Colors.primary} />
                                        <VStack>
                                            <BoldText1 text="Report an issue" color={Colors.dark} />
                                            <BoldText text="Tell us something about this merchant" color="grey" />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>


                            <Divider marginVertical={16} bgColor="gray.200" />

                            <TouchableOpacity style={{
                                marginBottom: 10
                            }} onPress={() => {
                                if (data.bal < 1) {
                                    setbottomSheet(!bottomSheet)
                                    handleRemoveMerchant()
                                }
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <HStack space={4} alignItems="center" >
                                        <DeleteIcon />
                                        <VStack>
                                            <BoldText1 text="Remove merchant" color={Colors.dark} />
                                            <BoldText text="Merchant will be removed from your list" color="grey" />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>


                        </Stack>
                    </>}


                    {bottomSheetAction == "REVERSE TOKEN" && <>
                        {/* {console.log(SingleToken)} */}
                        <BoldText text={SingleToken && SingleToken.token} color="lightgrey" style={{ marginTop: 10 }} />
                        <Stack mt={5} mb={10} style={{
                            width: "100%",
                            padding: 15
                        }} >
                            <TouchableOpacity onPress={() => {
                                setbottomSheet(!bottomSheet)
                                handleDeactivateToken(SingleToken.token)
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" backgroundColor={Colors.dark} style={{
                                    padding: 10,
                                    borderRadius: 10
                                }} >
                                    <HStack space={4}>
                                        <DeleteIcon />
                                        <VStack>
                                            <BoldText1 text="Deactivate Token" color={Colors.primary} />
                                            <BoldText text={`${NumberWithCommas(SingleToken.amount)} will be reversed to your wallet`} color="lightgrey" />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>
                        </Stack>
                    </>}
                    {/* handleDeactivateToken */}


                </Actionsheet.Content>
            </Actionsheet>
        </>
    );
}

 


export default Merchantprofile;
