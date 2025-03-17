import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { CustomButtons } from '../../global-components/buttons';
import { Center, HStack } from 'native-base';
import { BackIcon } from '../../global-components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color } from '../../global-components/colors';
import { VerifyAccountController } from '../controllers';
import { appState } from '../../state';
import { CircleCheck } from 'lucide-react-native';
import { BoldText, BoldText1 } from '../../global-components/texts';
import { Loader } from '../../global-components/loader';
const Colors = Color()
const OTPVerification = ({ navigation, route }) => {
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputs = useRef([]);

    let { User, isBiometric, login } = appState()
    const [data, setData] = useState(route.params);
    const [loading, setloading] = React.useState(false)
    const [miniloading, setminiloading] = React.useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);



    const handleChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 4) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        // if (otp.join('').length === 5) {
        //     Alert.alert('OTP Verified', `Entered OTP: ${otp.join('')}`);
        // } else {
        //     Alert.alert('Error', 'Please enter a valid 5-digit OTP.');
        // }
        if (data.data.OTP != otp.join('')) {
            setError(true)
            Alert.alert('Error', 'Please enter a valid 5-digit OTP.');
        } else {
            setError(false)
            if (data.type && data.type == "RESET-PWD") {
                navigation.replace("Reset-pwd", { data: data.data })
            } else {
                setloading(true)
                VerifyAccountController({ setloading, Alert, navigation, data: data, login, setModalVisible })
            }
        }
    };

    const handleResendCode = () => {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your email or phone number.');
    };

    const isButtonActive = otp.every((digit) => digit !== '');

    return <>
        <SafeAreaView style={styles.container}>
            {console.log(data)}
            <HStack alignItems="center" justifyContent="flex-start" space={5} >
                <TouchableOpacity onPress={() => {
                    // navigation.replace("Onboarding")
                }}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={styles.headerText}>Email verification</Text>
            </HStack>


            <Text style={styles.subtitle}>Enter the 5 digit code sent to your email or phone number</Text>

            <HStack style={styles.otpContainer} space={5} my={6} >
                {otp.map((digit, index) => (
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
            <Center>
                <CustomButtons
                    width="90%"
                    text="Verify"
                    primary
                    opacity={isButtonActive ? 1 : 0.3}
                    // Loading={loading}
                    callBack={handleVerify}
                />


                <Text style={styles.resendText}>Didn't receive any code? <Text onPress={handleResendCode} style={styles.resendLink}>Resend code</Text></Text>

            </Center>



            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.overlay}>
                    <View style={styles.modalView}>
                        <CircleCheck size={150} strokeWidth={0.8} color={Colors.dark} />

                        <Text style={{
                            fontSize: 25,
                            fontWeight: 500,
                            color: Colors.dark,
                            textAlign: 'center',
                            marginTop: 20
                        }}>
                            Account verified successfully.
                        </Text>

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                            setModalVisible(false);
                            navigation.replace("kyc-onboarding")
                        }} >
                            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.registerButtonText}>Complete KYC</Text>}
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>


        </SafeAreaView>
        <Loader loading={loading} />
    </>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#FFF', padding: 15
    },
    headerText: { fontSize: 20, fontWeight: 'bold' },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        // textAlign: 'center',
        marginVertical: 40,
        paddingHorizontal: 10,
        marginTop: 70,
        fontWeight: "regular"
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    otpInput: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 5,
        borderRadius: 10,
    },
    verifyButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 10,
    },
    verifyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendText: {
        fontSize: 14,
        color: '#555',
    },
    resendLink: {
        color: Colors.dark,
        fontWeight: 'bold',
    },



    // =====

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: "80%",
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
    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default OTPVerification;