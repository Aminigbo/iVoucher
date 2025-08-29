import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

import { Center, CheckCircleIcon, Divider, HStack } from 'native-base';
import { Color } from '../../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from "../../state/index.js"
import { BoldText, BoldText1 } from '../../global-components/texts.js';
import { AppIcon, KYCICon } from '../../global-components/icons.js';

import { Loader } from '../../global-components/loader.js';



import { CreatePinController } from '../../home/service/index.js';
import { ArrowBigDown, ArrowBigUp, PlusCircleIcon, ShieldEllipsis } from 'lucide-react-native';
import { LoginSvgs } from '../../assets/svgs.js';


const Colors = Color()



function CreatePin({ navigation }) {
    let { User, login } = appState()
    const [loading, setloading] = React.useState(false)

    const [inputs, setInputs] = useState(['', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const handleKeyPress = (key) => {
        // navigation.replace("kyc-onboarding")
        if (key === 'Del') {
            setError(false)
            if (currentIndex > 0) {
                const updatedInputs = [...inputs];
                updatedInputs[currentIndex - 1] = '';
                setInputs(updatedInputs);
                setCurrentIndex(currentIndex - 1);
            }
        } else if (key === "DONE") {
            let inputedPin = inputs.join('');
            if (inputedPin.length == 4) {
                CreatePin(inputedPin)
            }

        } else if (currentIndex < 4) {
            const updatedInputs = [...inputs];
            updatedInputs[currentIndex] = key;
            setInputs(updatedInputs);
            setCurrentIndex(currentIndex + 1);
            let inputedPin = updatedInputs.join('');

        }
    };


    function CreatePin(key) {
        console.log(User.uid)
        setloading(true)
        CreatePinController({ user: User.uid, pin: key })
            .then(response => {
                setloading(false)

                if (response.success == false) {
                    return console.log(error)
                }

                login({
                    ...response.data,
                    ...User,
                })
                // navigation.replace("Home")
                setModalVisible(true)
                // console.log(response)
                setloading(false)
            })
            .catch(error => {
                setloading(false)
                console.log(error)
            })
    }



    return User.pin ? navigation.replace("Home") : (
        // return (
        <>
            {User &&
                <>
                    {/* {console.log(User)} */}
                    <SafeAreaView style={styles.container}>
                        <Center mt={30} style={{
                            marginTop: 50,
                        }} >

                            <LoginSvgs />

                            <Center style={{
                                marginTop: 40
                            }}>
                                <Text style={[styles.registerText, { marginTop: 10, }]}>
                                    <BoldText1 color="#000" text={`(${User.email.slice(0, 2)}***${User.email.slice(-6)})`} />
                                </Text>
                                <Text style={[styles.registerText, { marginTop: 10, }]}>
                                    Set your 4-digit pin to secure your account.
                                </Text>

                                {/* Input Boxes */}
                                <View style={styles.inputContainer}>
                                    {inputs.map((input, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.inputBox,
                                                currentIndex === index && styles.activeInputBox,
                                                {
                                                    borderColor: Colors.dark,
                                                    backgroundColor: input ? Colors.dark : '#fff'
                                                }
                                            ]}
                                        />
                                    ))}
                                </View>

                                {/* Custom Keyboard */}
                                <View style={styles.keysContainer}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Del', 0, 'DONE'].map((key, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.keyButton,
                                                key === 'Del' && styles.deleteKey,
                                            ]}
                                            onPress={() => handleKeyPress(key)}
                                        >
                                            <Text style={styles.keyText}>
                                                {key === 'Del' ? '⌫' : key === 'DONE' ?
                                                    inputs.join('').length == 4 ?
                                                        <CheckCircleIcon size={8} color={Colors.dark} />
                                                        : <CheckCircleIcon size={8} color="lightgrey" />
                                                    : key}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                            </Center>

                        </Center>

                    </SafeAreaView>

                    <Loader loading={loading} />


                    {modalVisible &&
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            // visible={true}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <View style={styles.overlay}>
                                <View style={styles.modalView}>
                                    <ShieldEllipsis size={150} strokeWidth={1} color={Colors.primary} />

                                    <BoldText
                                        size={18}
                                        color={Colors.dark}
                                        style={{
                                            textAlign: "center",
                                            fontWeight: "bold"
                                        }}
                                        text="Your 4-digit pin has been set successfully."
                                    />

                                    <TouchableOpacity
                                        style={{
                                            marginVertical: 30,
                                        }}
                                        onPress={() => {
                                            setModalVisible(false);
                                            setloading(false)
                                            navigation.replace("Home")
                                        }} >
                                        <Text style={{ color: Colors.primary }}>Okay</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </Modal>
                    }
                </>
            }
        </>
    );
}




export default CreatePin;



const styles = StyleSheet.create({

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
    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },





    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

        marginTop: 50
    },
    inputBox: {
        width: 32,
        height: 32,
        marginHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f5f5f5',
        backgroundColor: 'red',
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
        marginTop: 40,
    },
    keyButton: {
        width: '30%',
        height: 90,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.dark,
    },

    keyText: {
        fontSize: 25,
        color: Colors.dark,
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
