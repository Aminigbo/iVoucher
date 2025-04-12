import React, { useCallback, useEffect, useState } from 'react';
import { Text, HStack, Divider, Select, CheckIcon, Center } from 'native-base';
import { Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { BackIcon } from '../global-components/icons';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NumberWithCommas } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons } from '../global-components/buttons';
import { ConversionRateController, FundCardController, GetCardDetailsController, WithdrawCardController } from '../auth/controllers';
import { ArrowBigDown, ArrowBigUp, CheckCircle2Icon, PlusCircleIcon, ShieldEllipsis } from 'lucide-react-native';
import { FetchUserInfoService } from '../auth/service';


const Colors = Color()

function CardTopup({ navigation, disp_transactions, }) {
    const [loadingText, setloadingText] = React.useState("")
    const [bottomSheetType, setbottomSheetType] = React.useState("")
    const [topupAmount, settopupAmount] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [claimCard, setclaimCard] = useState(false)
    const [conversionRate, setconversionRate] = useState(null)
    const [CardInfo, setCardInfo] = useState(null)

    // 

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



    function FundCardHandler() {
        setLoading(true)
        FundCardController(setLoading, setloadingText, topupAmount, topupAmount * conversionRate.rate, User.card.reference, User.id, fundingSource, setModalVisible, fetchUserInfo, GetAllTransactions)
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            getConversionRateHandler()
        });

        return unsubscribe;

    }, [navigation]);



    return !User ? navigation.replace("Login") : (
        // return (
        <>
            {/* {console.log(User.card.reference)} */}

            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
                padding: 15, justifyContent: "space-between"
            }} >

                <View style={[{ width: "100%", }, styles.shadowBox]}>
                    <HStack style={styles.header} alignItems="center" space={10} >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Top Up Card</Text>
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
                        <Select.Item label={`NGN Balance - NGN ${NumberWithCommas(User.wallet)}`} value="NGN" />
                        <Select.Item label={`USD Balance - USD ${NumberWithCommas(User.UsdBal ? User.UsdBal : 0)}`} value="USD" />
                    </Select>

                    {/* <Divider /> */}

                    <BoldText text={`Amount`} color="#000" style={{ marginTop: 45, }} />
                    <HStack space={3} style={{
                        alignItems: "center",
                    }} >
                        <Text fontSize={17} fontWeight="normal" color={Colors.dark} >  USD </Text>
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
                                <Text fontSize={15} fontWeight="medium" color={Colors.dark} style={{ marginTop: 20 }} >
                                    $1.00 = ₦
                                    {conversionRate && NumberWithCommas(conversionRate.rate)}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </HStack>

                </View>

                <CustomButtons
                    callBack={() => {
                        FundCardHandler()
                        // FundCard(topupAmount, topupAmount * conversionRate.rate, setCardInfo, fundingSource)
                        setclaimCard(false)
                        settopupAmount("")
                    }}
                    primary={topupAmount > 4 && fundingSource != null && true}
                    opacity={topupAmount < 5 ? 0.3 : fundingSource != null && 1}
                    text="Top up"
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
                            text="Successfully funded card"
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
                                You can now make purchases from your card.
                            </Text>
                        </HStack>

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            navigation.pop()
                        }} >
                            <Text style={styles.registerButtonText}>See balance</Text>
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

});
