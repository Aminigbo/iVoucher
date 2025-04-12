import React, { useCallback, useEffect, useState } from 'react';
import { Text, Box, VStack, HStack, Icon, Stack, Divider, AddIcon, Image, Center, FlatList, Overlay, Actionsheet, CheckCircleIcon, Alert, SmallCloseIcon, Select, CheckIcon } from 'native-base';
import { Modal, PermissionsAndroid, Platform, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BoldText, } from '../global-components/texts';
import { ArrowForward, BackIcon } from '../global-components/icons';
import { CardComponent } from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, ImagePicker, NumberWithCommas } from '../utilities';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { CustomButtons, LinkButtons } from '../global-components/buttons';
import { Activity, ArrowBigDown, ArrowBigUp, ArrowDownUp, BadgePlus, ChartPie, CheckCheck, CheckCircle, CheckCircle2Icon, Copy, CreditCard, Delete, DollarSign, Download, Ellipsis, EyeIcon, Globe, IdCard, Landmark, Menu, Minus, Plus, PlusCircleIcon, Send, Share, Share2Icon, ShieldEllipsis, Snowflake, UploadCloud, UserCheck } from 'lucide-react-native';
import { Input } from '../global-components/input';
import { ConversionRateController, FundCardController, GetCardDetailsController, WithdrawCardController } from '../auth/controllers';
import { useAppActions } from '../state/state2';
import { FetchUserInfoService } from '../auth/service';

const Colors = Color()

function CardWithdrawal({ navigation }) {
    const [loadingText, setloadingText] = React.useState("")
    const [topupAmount, settopupAmount] = React.useState("")
    const [destination, setdestination] = React.useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = React.useState(false)

    const [claimCard, setclaimCard] = useState(false)
    const [CardInfo, setCardInfo] = useState(null)




    let { User, Loading, login, CardWithdrawal, SaveTrxn, VerifyNIN, CreateCard, ConversionRate, GetCardDetails, FundCard, GetAllTransactions } = appState()


    function GetCardDetailsHandler() {
        User.card && GetCardDetailsController(setLoading, User.card.reference, setCardInfo);
    }


    function WithdrawCardHandler() {
        setLoading(true)
        WithdrawCardController(setLoading, setloadingText, User, topupAmount, User.card.reference, setModalVisible, fetchUserInfo, GetAllTransactions, destination)
    }


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



    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            User.card && GetCardDetailsHandler();
        });

        return unsubscribe;

    }, [navigation]);



    return !User ? navigation.replace("Login") : (
        // return (
        <>
            {console.log(User.jk)}

            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
                padding: 15, justifyContent: "space-between"
            }} >

                <View style={[{ width: "100%", }, styles.shadowBox]}>

                    <HStack style={styles.header} alignItems="center" space={10} >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Withdraw Funds</Text>
                    </HStack>



                    <BoldText text="Please, note that the funds will be withdrawn to your USD account" color="#000" style={{}} />

                    {/* <Divider style={{marginVertical:30}} /> */}

                    <BoldText text={`Withdrawal destination`} color="#000" style={{ marginTop: 50 }} />
                    <Select
                        style={[styles.input, { fontSize: 17, fontWeight: 500, color: "#000", borderWidth: 0 }]}
                        selectedValue={destination}
                        minWidth="200" accessibilityLabel="Choose destination"
                        placeholder="Select destination account" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => {
                            setdestination(itemValue)
                        }} borderWidth={0}>
                        <Select.Item label={`NGN Balance - NGN ${NumberWithCommas(User.wallet)}`} value="NGN" />
                        <Select.Item label={`USD Balance - USD ${NumberWithCommas(User.UsdBal ? User.UsdBal : 0)}`} value="USD" />
                    </Select>



                    <BoldText text={`Amount to withdraw`} color="grey" style={{ marginTop: 50 }} />
                    <HStack space={3} style={{
                        alignItems: "center",
                    }} >
                        <Text fontSize={17} fontWeight="normal" color={Colors.dark} >  USD </Text>
                        <TextInput style={[styles.input, { fontSize: 20, fontWeight: 300, color: "#000", width: "80%", borderBottomWidth: 0 }]}
                            placeholder="0.00"
                            placeholderTextColor="grey"
                            onChangeText={settopupAmount}
                            // value={topupAmount}

                            keyboardType='numeric'
                        />
                    </HStack>


                    <Divider />
                    <HStack justifyContent="space-between" >
                        <Text fontSize={15} fontWeight="thin" color={Colors.dark} style={{ marginTop: 20 }} >
                            Card balance:  <Text fontSize={15} fontWeight="bold" color={Colors.dark} style={{ marginTop: 20 }} >
                                {CardInfo ? `${NumberWithCommas(CardInfo.balance)}.00` : "0.00"}
                            </Text>
                        </Text>
                    </HStack>

                </View>
                <CustomButtons
                    callBack={() => {
                        // CardWithdrawal(topupAmount, CardInfo.reference, setCardInfo)
                        WithdrawCardHandler()
                        setclaimCard(false)
                        settopupAmount("")
                    }}
                    primary={topupAmount > 0 && true}
                    opacity={topupAmount < 1 ? 0.3 : 1}
                    text="Withdraw funds"
                />

            </SafeAreaView>


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
                                textAlign: "center"
                            }}
                            text="Successfully funded card"
                        />

                        <Divider my={7} />

                        <HStack space={4} style={{
                            alignItems: "center",
                            paddingHorizontal: 10
                        }} >

                            <Text fontSize="lg" fontWeight="light" color={Colors.dark}>
                                Your withdrawal request has been sent successfully.
                            </Text>
                        </HStack>

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            navigation.pop()
                        }} >
                            <Text style={styles.registerButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <Loader loading={loading}
            // text={loadingText} 
            />

        </>
    );
}




export default CardWithdrawal;


const styles = StyleSheet.create({

    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 30
    },

    input: {
        padding: 15,
        marginVertical: 10,
        borderColor: '#ddd', borderBottomWidth: 1, borderRadius: 5, width: "100%",
        color: "#000"
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
