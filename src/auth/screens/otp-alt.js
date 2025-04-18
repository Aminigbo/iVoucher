// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';

import { Button, Center, HStack, VStack } from 'native-base';
import { Color } from '../../global-components/colors';
// import { initAuth, User } from '../../redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from "../../state/index.js"
import { AppIcon, BackIcon } from '../../global-components/icons.js';
import { Loader } from '../../global-components/loader.js';
import { RequestOtpController, VerifyAccountController } from '../controllers/index.js';
import { BoldText, BoldText1 } from '../../global-components/texts.js';
import { CircleCheck } from 'lucide-react-native';

const Colors = Color()


function Biometrics({ navigation, route }) {
    let { User, isBiometric, login } = appState()
    const [data, setData] = useState(route.params);
    const [loading, setloading] = React.useState(false)
    const [miniloading, setminiloading] = React.useState(false)

    const [inputs, setInputs] = useState(['', '', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleKeyPress = (key) => {
        if (key === 'Del') {
            setError(false)
            if (currentIndex > 0) {
                const updatedInputs = [...inputs];
                updatedInputs[currentIndex - 1] = '';
                setInputs(updatedInputs);
                setCurrentIndex(currentIndex - 1);
            }
        } else if (key === "BACK") {
            navigation.pop()
        } else if (currentIndex < 5) {
            const updatedInputs = [...inputs];
            updatedInputs[currentIndex] = key;
            setInputs(updatedInputs);
            setCurrentIndex(currentIndex + 1);

            // Log input values when length is 4
            if (currentIndex + 1 === 5) {
                let inputedPin = updatedInputs.join('');
                if (data.data.OTP != inputedPin) {
                    setError(true)
                } else {
                    setError(false)
                    if (data.type && data.type == "RESET-PWD") {
                        navigation.replace("Reset-pwd", { data: data.data })
                    } else {
                        setloading(true)
                        VerifyAccountController({ setloading, Alert, navigation, data: data, login, setModalVisible })
                    }
                }
            }

        }
    };

    const handleResendOtp = () => {
        setminiloading(true)
        RequestOtpController({
            setloading: setminiloading,
            Alert,
            navigation,
            email: data.email,
        })
    };

    return (
        <>
        {console.log(data)}
            <SafeAreaView style={styles.container}>
                <Center mt={30} style={{
                    marginTop: 50,
                }} >

                    <AppIcon />
                    <Text style={[styles.headerText, { marginTop: 20 }]}>Verify your account</Text>
                    <Text style={styles.subHeaderText}>Enter the 5-digit code sent to your email or phone</Text>

                    <View style={{
                        // marginTop: 10
                    }}>
                        {/* Input Boxes */}
                        <View style={styles.inputContainer}>
                            {inputs.map((input, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.inputBox,
                                        currentIndex === index && styles.activeInputBox,
                                        {
                                            borderColor: error ? Colors.primary : null,
                                            backgroundColor: input ? '#000' : '#fff'
                                        }
                                    ]}
                                />
                            ))}
                        </View>
                        <Text style={[styles.registerText, { marginTop: 20, color: "crimson" }]}>
                            {error && " You entered a wrong OTP"}
                        </Text>


                        {/* Custom Keyboard */}
                        <View style={styles.keysContainer}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'BACK', 0, 'Del'].map((key, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.keyButton,
                                        key === 'Del' && styles.deleteKey,
                                    ]}
                                    onPress={() => handleKeyPress(key)}
                                >
                                    <Text style={styles.keyText}>
                                        {key === 'Del' ? '⌫' : key === 'BACK' ?
                                            <BackIcon color={isBiometric ? Colors.primary : "lightgrey"} />
                                            : key}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>

                </Center>

            </SafeAreaView>

            <Loader loading={loading} />

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

                        <BoldText1
                            size={20}
                            color={Colors.dark}
                            style={{
                                textAlign: "center"
                            }}
                            text="Account verified successfully."
                        />

                        <TouchableOpacity style={styles.registerButton} onPress={() => {
                             setModalVisible(false);
                            navigation.replace("kyc-onboarding")
                        }} >
                            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.registerButtonText}>Complete KYC</Text>}
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </>
    );
}




export default Biometrics;



const styles = StyleSheet.create({
    registerText: {
        color: Colors.dark,
        textAlign: "center"
    },

    container: {
        backgroundColor: "#fff",
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

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
        borderColor: 'red',
        // borderWidth: 1,
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
        marginTop: 20,
    },
    keyButton: {
        width: '30%',
        height: 90,
        // aspectRatio: 1,
        // padding: '2%',
        backgroundColor: '#fff',
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

    headerText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    subHeaderText: { fontSize: 16, color: '#666', marginBottom: 10, textAlign: 'center' },



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
    registerButton: { backgroundColor: '#000', paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },
});
