import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Card,
    CardHeader,
    Flex,
    Badge,
    Divider,
    HStack,
    Center
} from 'native-base';
import { FlatList, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BackIcon, CloseIcon } from '../global-components/icons';
import { BoldText } from '../global-components/texts';
import { LinkButtons } from '../global-components/buttons';
import { CardIcon } from '../assets/svgs';
import { Color } from '../global-components/colors';
import { CircleCheck, File } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { appState } from '../state';
import { FetchMedicalRecordsController, RequestConsentTokenController, VerifyConsentTokenController } from './service';
import { formatDate } from '../utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../global-components/loader';

const Colors = Color()
const MedicalRecordUI = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [otpInput, setotpInput] = useState(false);
    const [loadingText, setloadingText] = useState("")
    let { User, login, Transactions, GetCardDetails } = appState()
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputs = useRef([]);


    // Sample medical records data (replace with actual data source)
    const [medicalRecords, setMedicalRecords] = useState([]);


    // fetch medical records
    const handleFetchMedicalRecords = useCallback(async (consent_token) => {
        console.log(consent_token)
        setloadingText("Fetch medical records")
        setLoading(true)
        FetchMedicalRecordsController(User.health_id, consent_token)
            .then(res => {
                console.log(res.data.records[0])
                if (res.success == true) {
                    setMedicalRecords(res.data)
                } else {
                    if (res.status == 401) {
                        AsyncStorage.removeItem("consent_token")
                        RequestConsentTokenHandler(User.health_id)
                    } else {
                        Alert.alert("Error", res.message)
                    }
                }
            })
            .catch(err => {
                Alert.alert("Error", err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [User]);

    const RequestConsentTokenHandler = useCallback(async () => {
        setloadingText("Requesting consent token to access your medical record")
        setLoading(true)
        RequestConsentTokenController(User.health_id)
            .then(res => {
                if (res.success == true) {
                    console.log(res)
                    setotpInput(true)
                } else {
                    Alert.alert("Error", res.message)
                }
            })
            .finally(() => {
                setLoading(false)
            })
            .catch(err => {
                Alert.alert("Error", err.message)
            })
    }, [User]);

    const VerifyConsentTokenHandler = useCallback(async (joinedOTP) => {
        setloadingText("Verifying consent token to access your medical record")
        setLoading(true)
        setotpInput(false)
        // console.log(joinedOTP)
        VerifyConsentTokenController(joinedOTP, User.health_id)
            .then(res => {
                if (res.success == true) {
                    // console.log(res)
                    AsyncStorage.setItem("consent_token", res.data.consentToken)
                    handleFetchMedicalRecords(res.data.consentToken)
                } else {
                    Alert.alert("Error", res.message)
                }
            })
            .finally(() => {
                setLoading(false)
            })
            .catch(err => {
                Alert.alert("Error", err.message)
            })
    }, [User, otp]);


    const handleChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 4) {
            inputs.current[index + 1].focus();
        }
        if (index == 4 && text) {
            VerifyConsentTokenHandler(newOtp.join(""))
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const check_consent_token = await AsyncStorage.getItem("consent_token")
            if (check_consent_token == null) {
                RequestConsentTokenHandler(User.health_id)
            } else {
                handleFetchMedicalRecords(check_consent_token)
            }
        });
        return unsubscribe;
    }, [navigation]);


    return (
        <>
            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
                justifyContent: "space-between"
            }} >
                {/* {console.log(User)} */}
                <HStack style={styles.header} alignItems="center" space={10} >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.welcomeText}>Medical Record</Text>
                </HStack>

                <FlatList
                    data={medicalRecords.records}
                    renderItem={({ item }) => {
                        return <TouchableOpacity onPress={() => navigation.navigate("View-record", { record: item })}>
                            <HStack space={5} style={styles.banner}>
                                <VStack space={3} style={{ flex: 3, justifyContent: "flex-start", alignItems: "flex-start" }}>
                                    <Text style={{ fontSize: 14, fontWeight: "bold", color: Colors.primary }}>{item.type}</Text>
                                    <BoldText
                                        color={Colors.dark}
                                        size={14}
                                        text={item.data.note}
                                    />
                                    {/* <BoldText
                                    color={Colors.dark}
                                    size={14}
                                    text={`${item.data.diagnosedBy}`}
                                /> */}
                                    <HStack space={2} style={{ alignItems: "center" }}>
                                        <Text>{formatDate(item.created_at)}</Text>
                                        <Text>|</Text>
                                        <Text>{item.data.diagnosedBy}</Text>
                                    </HStack>
                                </VStack>
                                <Center flex={1} style={{ marginTop: 20, alignItems: "center" }}>
                                    <File size={40} strokeWidth={1} color={Colors.primary} />
                                    <Text>{item.data.files.length}</Text>
                                </Center>
                            </HStack>
                        </TouchableOpacity>

                    }}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                        return loading ? <ActivityIndicator size="large" color={Colors.primary} /> : <Text style={{ textAlign: "center", marginTop: 20 }} >No medical records found</Text>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={async () => {
                            const check_consent_token = await AsyncStorage.getItem("consent_token")
                            if (check_consent_token == null) {
                                RequestConsentTokenHandler()
                            } else {
                                handleFetchMedicalRecords(check_consent_token)
                            }
                        }} />
                    }
                />


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={otpInput}
                    onRequestClose={() => {
                        // setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.overlay}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", top: 0, right: 0, zIndex: 1000, padding: 10 }}>
                                <CloseIcon size={20} color={Colors.dark} />
                            </TouchableOpacity>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 500,
                                color: Colors.dark,
                                textAlign: 'center',
                                marginTop: 20
                            }}>
                                Enter Security Code
                            </Text>
                            <HStack style={styles.otpContainer} space={5} my={6} >
                                {[1, 2, 3, 4, 5].map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        style={styles.otpInput}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        ref={(ref) => (inputs.current[index] = ref)}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        value={digit}
                                    />
                                ))}
                            </HStack>

                            <Text style={{ fontSize: 14 }}>Enter the security code sent to your email to access your medical record</Text>
                        </View>

                    </View>
                </Modal>


            </SafeAreaView>
            <Loader loading={loading} text={loadingText} />
        </>
    );
};

export default MedicalRecordUI;

const styles = StyleSheet.create({
    header: {
        marginBottom: 30,
        marginHorizontal: 15,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    banner: {
        height: 120,
        backgroundColor: Colors.accent,
        marginHorizontal: 15,
        marginVertical: 10,
        position: "relative",
        borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    cardButton: {
        // backgroundColor: Colors.dark,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    // ================================
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: "95%",
        // height: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
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

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    otpInput: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 5,
        borderRadius: 10,
    },

});
