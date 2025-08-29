import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, HStack, Divider, Select, CheckIcon, Center } from 'native-base';
import { Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { BackIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateTransactionRef, NumberWithCommas, FlutterwaveKey } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons } from '../global-components/buttons';
import { ConversionRateController, FundCardController, GetCardDetailsController, WithdrawCardController } from '../auth/controllers';
import { ArrowBigDown, ArrowBigUp, CheckCircle2Icon, PlusCircleIcon, ShieldEllipsis } from 'lucide-react-native';
import { FetchUserInfoService } from '../auth/service';
import PayWithFlutterwave from 'flutterwave-react-native';


const Colors = Color()

function CardTopup({ navigation, disp_transactions, route }) {
    const [loadingText, setloadingText] = React.useState("")
    const [bottomSheetType, setbottomSheetType] = React.useState("")
    const [topupAmount, settopupAmount] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [claimCard, setclaimCard] = useState(false)
    const [conversionRate, setconversionRate] = useState(null) 

    // get card info from route
    const { CardInfo } = route.params

    const [fundingSource, setFundingSource] = React.useState(null)

    let { User, login, GetAllTransactions } = appState()


    const fetchUserInfo = useCallback(() => {
        setLoading(true);

        FetchUserInfoService(User.id)
            .then(response => {
                if (response.success) {
                    login({ ...User, ...response.data });
                } else {
                    Alert.alert("Error", response.message);
                }
                setLoading(false);
                setModalVisible(true)
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [User, login]);



    function getConversionRateHandler() {
        setLoading(true)
        ConversionRateController(setLoading, 5000, setconversionRate, setloadingText, setclaimCard, setbottomSheetType, "CARD-TOPUP")
    }



    function FundCardHandler(data) {
        setLoading(true)
        FundCardController(setLoading, setloadingText, topupAmount, CardInfo.card_number, User, login, navigation, setModalVisible, data)
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            // getConversionRateHandler()
        });
        return unsubscribe;
    }, [navigation]);


    const handleOnRedirect = (data) => {
        console.log(data);
        FundCardHandler(data)
    };


    return !User ? navigation.replace("Login") : (
        // return (
        <>


            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
                padding: 15, justifyContent: "space-between"
            }} > 

                <View style={[{ width: "100%", }, styles.shadowBox]}>
                    <HStack style={styles.header} alignItems="center" space={10} >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Topup Medicard</Text>
                    </HStack>


                    <BoldText text={`Funding source`} color="#000" style={{ marginTop: 20 }} />
                    <Select
                        style={[styles.input, { fontSize: 17, fontWeight: 500, color: "#000", borderWidth: 0 }]}
                        selectedValue={fundingSource}
                        minWidth="200" accessibilityLabel="Choose Service"
                        placeholder="Select funding source" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => {
                            setFundingSource(itemValue)
                        }} borderWidth={0}>
                        <Select.Item label={`Flutterwave - (card, bank, etc)`} value="Flutterwave" />
                        {/* <Select.Item label={`Request from friends`} value="Request from friends" /> */}
                    </Select>

                    {/* <Divider /> */}

                    <BoldText text={`Amount`} color="#000" style={{ marginTop: 45, }} />
                    <HStack space={3} style={{
                        alignItems: "center",
                    }} >
                        <Text fontSize={17} fontWeight="normal" color={Colors.dark} > ₦ </Text>
                        <TextInput style={[styles.input, { fontSize: 20, fontWeight: 300, color: "#000", width: "85%", padding: 10, borderBottomWidth: 0 }]}
                            placeholder="0.00"
                            onChangeText={settopupAmount}
                            // value={topupAmount}

                            keyboardType='numeric'
                        />
                    </HStack>
                    <Divider />
                    <HStack justifyContent="space-between" style={{
                        marginBottom: 30,
                    }} >
                        <TouchableOpacity onPress={() => {
                            getConversionRateHandler()
                        }}>
                            <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{ marginTop: 20 }} >
                                <Text fontSize="sm" fontWeight="light" color={Colors.dark} style={{ marginTop: 20 }} >
                                    Your Medicard topup is secured by <Text fontSize="sm" fontWeight="bold" color="#611336" >Healthstack</Text>
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </HStack>

                </View>

                <PayWithFlutterwave
                    onRedirect={handleOnRedirect}
                    options={{
                        tx_ref: generateTransactionRef(),
                        authorization: FlutterwaveKey,
                        amount: 1000,
                        currency: 'NGN',
                        customer: {
                            email: User?.email,
                            name: User?.name,
                        },
                        meta: {
                            consumer_id: User?.uid,
                        },
                        payment_options: 'card, banktransfer, ussd, mobile_money',
                    }}
                    customButton={(props) => (
                        <TouchableOpacity
                            style={[styles.signInButton, props.isInitializing && styles.signInButtonDisabled]}
                            onPress={() => {
                                if (topupAmount < 1000 || fundingSource == null) {
                                    Alert.alert("Error", "Please fill all fields")
                                    return
                                }
                                props.onPress()
                            }}
                            // onPress={saveSosCredit}
                            isBusy={props.isInitializing}
                            disabled={props.disabled}>
                            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Top up</Text>
                        </TouchableOpacity>
                    )}
                />

            </SafeAreaView>


            <Loader loading={loading}
                text={loadingText}
            />


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.overlay}>
                    <View style={styles.modalView}>
                        <CheckCircle2Icon size={150} strokeWidth={0.8} color={Colors.primary} />

                        <BoldText
                            size={18}
                            color={Colors.dark}
                            style={{
                                textAlign: "center",
                                marginTop: 15
                            }}
                            text="Successfully funded medicard"
                        />

                        <Divider my={7} />

                        <HStack space={4} style={{
                            alignItems: "center",
                            paddingHorizontal: 10
                        }} >
                            <Center style={{
                                borderRadius: 30,
                                backgroundColor: "#FEF4EA",
                                width: 45,
                                height: 45,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                            }} >
                                <ArrowBigUp size={25} color={Colors.dark} />
                            </Center>
                            <Text fontSize="lg" fontWeight="light" color={Colors.dark}
                                style={{
                                    flex: 1
                                }}
                            >
                                {/* Your card has been funded successfully. */}
                                You can now use your medicard for your medical expenses.
                            </Text>
                        </HStack>

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            navigation.pop()
                        }} >
                            <Text style={styles.registerButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </>
    );
}




export default CardTopup;


const styles = StyleSheet.create({

    input: {
        padding: 15,
        marginVertical: 10,
        borderColor: '#ddd', borderBottomWidth: 1, borderRadius: 5, width: "100%",
        color: "#000"
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 30
    },

    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },


    // Modal
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: "85%",
        // height: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },


    // =====
    signInButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginVertical: 40,
        minHeight: 50,
        justifyContent: 'center',
        width: "90%",
        alignSelf: "center"
    },
    signInButtonDisabled: {
        opacity: 0.7,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

});
