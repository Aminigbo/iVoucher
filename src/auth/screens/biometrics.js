// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Keyboard } from 'react-native';

import { Button, Center, HStack, Stack, VStack } from 'native-base';
import { Color } from '../../global-components/colors';
import { LoginController } from '../controllers';
import { connect } from 'react-redux';
// import { initAuth, User } from '../../redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from "../../state/index.js"
import ModalPop from '../../global-components/modal.js';
import { BoldText, BoldText1, BoldText2 } from '../../global-components/texts.js';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { AppIcon, BiometricIcon, PasswordIcon, SmallAvater, UserIcon } from '../../global-components/icons.js';
import { FetchUserInfoService, LoginService } from '../service/index.js';
import { Loader } from '../../global-components/loader.js';


import Animated, { useSharedValue, useAnimatedProps, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Circle } from 'react-native-svg';


const Colors = Color()



function Biometrics({ navigation }) {
    let { User, login, isBiometric, BiometricAuth } = appState()
    const [password, setPassword] = React.useState("")
    const [loading, setloading] = React.useState(false)
    const [startReauth, setstartReauth] = React.useState(false)
    const [useBiomAuth, setuseBiomAuth] = React.useState(isBiometric)


    function FetchUserInfo() {
        setloading(true)
        FetchUserInfoService(User.id)
            .then(response => {
                if (response.success == false) {
                    setloading(false)
                    Alert.alert("Error", response.message)
                } else if (response.success == true) {
                    login({
                        ...User,
                        ...response.data
                    })
                    navigation.navigate("Home")
                } else {
                    setloading(false)
                    Alert.alert("Error", "A network error occured")
                    setInputs(['', '', '', '']);
                    setCurrentIndex(0)
                }

            })
            .catch(error => {
                setloading(false)
                console.log(error)
            })
    }



    const handleBiometricAuth = async () => {
        const rnBiometrics = new ReactNativeBiometrics();

        const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
        const payload = epochTimeSeconds + 'some message';

        const { success, signature } = await rnBiometrics.createSignature({
            promptMessage: 'Sign in with biometrics',
            payload: payload, // Use a meaningful payload
        });

        if (success) {
            if (User) {
                FetchUserInfo()
            }

        } else {
            console.log('Signature creation failed');
        }
    };



    const [inputs, setInputs] = useState(['', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false);


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
        } else if (key === "BIOMETRICS") {
            isBiometric && handleBiometricAuth()

        } else if (currentIndex < 4) {
            const updatedInputs = [...inputs];
            updatedInputs[currentIndex] = key;
            setInputs(updatedInputs);
            setCurrentIndex(currentIndex + 1);

            // Log input values when length is 4
            if (currentIndex + 1 === 4) {
                let inputedPin = updatedInputs.join('');
                if (User.pin != inputedPin) {
                    // if (inputedPin != 8889) {
                    setError(true)
                    setInputs(['', '', '', '']);
                    setCurrentIndex(0)
                } else {
                    setError(false)
                    FetchUserInfo()

                }
            }

        }
    };


    async function handleReAuth() {
        Keyboard.dismiss()
        setloading(!loading)
        LoginService(User.email, password, User.token)
            .then(response => {
                if (response.success == false) {
                    setloading(false)
                    return Alert.alert("Error", "You entered a wrong password")
                }
                login({
                    ...User,
                    ...response.data
                })

                if (response.data.kyc == false) {
                    navigation.replace("kyc-onboarding")
                } else {
                    navigation.replace("Create-pin")
                    // console.log("User.pin", User.pin)
                }
                // setloading(false)

                // navigation.replace("Home")

            })
    }


    // return !User ? navigation.replace("Login") : (
    return (
        <>
            {User &&
                <>
                    <SafeAreaView style={styles.container}>
                        <Center mt={30} style={{
                            marginTop: 50,
                        }} >

                            <AppIcon />

                            <View style={{
                                marginTop: 40
                            }}>
                                {useBiomAuth ?
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 110
                                        }}
                                        onPress={handleBiometricAuth}

                                    >
                                        <VStack style={{
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            {/* <SmallAvater /> */}
                                            <BiometricIcon color={Colors.dark} />
                                            <BoldText1
                                                style={{ color: Colors.primary, marginTop: 20 }}
                                                text="Login with Fingerprint"
                                            />

                                            <Text style={[styles.registerText, { marginTop: 10, marginBottom: 50 }]}>
                                                {User && User.firstname}
                                                <BoldText1 color="#000" text={`(${User.email.slice(0, 2)}***${User.email.slice(-6)})`} />
                                            </Text>

                                        </VStack>
                                    </TouchableOpacity> : <>


                                        {User && User.pin ? <>

                                            <Text style={[styles.registerText, { marginTop: 10, }]}>
                                                {User.firstname}
                                                <BoldText1 color="#000" text={`(${User.email.slice(0, 2)}***${User.email.slice(-6)})`} />
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
                                                                borderColor: error ? Colors.danger : null,
                                                                backgroundColor: input ? Colors.dark : '#fff'
                                                            }
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                            <Text style={[styles.registerText, { marginTop: 20, color: "crimson" }]}>
                                                {error && " Wrong PIN"}
                                            </Text>

                                            {/* Custom Keyboard */}
                                            <View style={styles.keysContainer}>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'BIOMETRICS', 0, 'Del'].map((key, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={[
                                                            styles.keyButton,
                                                            key === 'Del' && styles.deleteKey,
                                                        ]}
                                                        onPress={() => handleKeyPress(key)}
                                                    >
                                                        <Text style={styles.keyText}>
                                                            {key === 'Del' ? '⌫' : key === 'BIOMETRICS' ?
                                                                <BiometricIcon color={isBiometric ? Colors.primary : "lightgrey"} />
                                                                : key}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </>
                                            : <>
                                                <TouchableOpacity onPress={() => {
                                                    setstartReauth(true)
                                                }} >
                                                    <VStack style={{
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 40
                                                    }}>
                                                        <BoldText1
                                                            style={{ color: Colors.primary, marginTop: 20 }}
                                                            text="Enter your password to login"
                                                        />

                                                        <Text style={[styles.registerText, { marginTop: 10, marginBottom: 30 }]}>
                                                            {User && User.firstname}
                                                            <BoldText1 color="#000" text={`(${User.email.slice(0, 2)}***${User.email.slice(-6)})`} />
                                                        </Text>

                                                        <PasswordIcon color={Colors.dark} />

                                                    </VStack>
                                                </TouchableOpacity>
                                            </>

                                        }



                                    </>
                                }
                            </View>

                        </Center>

                    </SafeAreaView>

                    <Loader loading={loading} />

                    <HStack
                        space={16}
                        style={{
                            // position: "absolute",
                            paddingBottom: 20,
                            backgroundColor: "#fff",
                            justifyContent: "center",
                            alignItems: "center",
                        }} >

                        <TouchableOpacity
                            onPress={() => {
                                login(null)
                                navigation.replace('Login')
                            }}
                        >
                            <BoldText
                                size={13}
                                text="Login with Password"
                            // style={styles.registerText}
                            />
                        </TouchableOpacity>


                        {useBiomAuth ?
                            <TouchableOpacity
                                onPress={() => {
                                    isBiometric ? setuseBiomAuth(!useBiomAuth) : setuseBiomAuth(false)
                                }}
                            >
                                <BoldText
                                    size={13}
                                    text="Login with Pin"
                                />
                            </TouchableOpacity>
                            : isBiometric ?
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.replace('Register')
                                        login(null)
                                    }}
                                >
                                    <BoldText
                                        size={13}
                                        text="Create New Account"
                                    />
                                </TouchableOpacity>
                                :

                                <BoldText
                                    color="lightgrey"
                                    size={13}
                                    text="Login with Biometrics"
                                />
                        }


                    </HStack>

                    <ModalPop open={startReauth}>
                        <Stack style={{
                            padding: 10
                        }} >

                            <Text style={[styles.registerText, { marginTop: 10, marginBottom: 30 }]}>
                                {User.firstname}
                                <BoldText1 color="#000" text={`(${User.email.slice(0, 2)}***${User.email.slice(-6)})`} />
                            </Text>

                            <TextInput style={styles.input}
                                placeholder="Enter your password"
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <TouchableOpacity
                                onPress={handleReAuth}
                                style={styles.loginButton}>
                                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.loginButtonText}>Continue</Text>}
                            </TouchableOpacity>
                        </Stack>
                    </ModalPop>
                </>
            }
        </>
    );
}




export default Biometrics;



const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
    welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, },
    input: {
        width: '90%',
        padding: 15,
        marginVertical: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: "center"
    },
    forgotPassword: { alignSelf: 'flex-end', marginVertical: 10 },
    loginButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        width: '50%',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
        alignSelf: "center"
    },
    loginButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    registerText: { color: Colors.dark, textAlign: "center" },


    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

        marginTop: 50
    },
    inputBox: {
        width: 30,
        height: 30,
        marginHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
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

});
