// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';

import { Button, HStack, VStack } from 'native-base';
import { Color } from '../../global-components/colors';
import { LoginController } from '../controllers';
import { connect } from 'react-redux';
// import { initAuth, User } from '../../redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from "../../state/index.js"
import ModalPop from '../../global-components/modal.js';
import { BoldText2 } from '../../global-components/texts.js';
import messaging from '@react-native-firebase/messaging';
import { BiometricIcon } from '../../global-components/icons.js';
import { handleBiometricAuth } from '../../helpers/biometrics.js';
import { FetchUserInfo } from '../../helpers/user.js';

const Colors = Color()
function LoginScreen({ navigation }) {
    const [loading, setloading] = React.useState(false)
    const [fcmToken, setfcmToken] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [Key, setkey] = React.useState(null) // biometric kay
    const [biometricLoader, setbiometricLoader] = React.useState(false) // biometric key
    const [modalData, setmodalData] = React.useState({
        isTrue: false,
        header: "",
        msg: "",
        callBack: null
    })

    let { User, login, Initialize, Initialized, isBiometric, BiometricAuth } = appState()

    async function handleLogin() {
        setloading(!loading)
        LoginController({
            setloading,
            Alert,
            navigation,
            email,
            password,
            fcmToken,
            setmodalData,
            modalData,
            login,
            Initialize
        })
    }


    async function GetFcmToke() {
        if (Platform.OS === 'ios') {
            const token = await messaging().getAPNSToken();
            messaging().setAPNSToken(`${token}`);
        }

        if (Platform.OS === "android") {
            // // Register the device for remote messages
            await messaging().registerDeviceForRemoteMessages();
        }


        // // Get the FCM token
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            setfcmToken(fcmToken)
            // console.log(fcmToken)
            // Use the token as needed (e.g., send to server)
        } else {
            console.log('Failed to get FCM token');
        }
    }

    React.useEffect(() => {
        GetFcmToke()
    }, [])

    // return !User ? navigation.replace("Biometrics") : (
    return (
        <SafeAreaView style={styles.container}>
            {/* {console.log(User)} */}
            <HStack alignItems="flex-start" justifyContent="flex-start" mb={20} >
                {/* <TouchableOpacity >
                    <BackIcon noPop={true} action={() => { navigation.replace("Onboarding") }} />
                </TouchableOpacity> */}
            </HStack>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <TextInput style={styles.input} placeholder="Enter your email" onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Enter your password" onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.forgotPassword} onPress={() => {
                // navigation.navigate("Home")
                navigation.navigate('Request-otp')
            }
            } >
                <Text>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin}
                style={styles.loginButton}>
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.loginButtonText}>Login</Text>}

            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Don’t have an account? Register Now</Text>
            </TouchableOpacity>





            <ModalPop open={modalData.isTrue}>
                <HStack space={3} style={{
                    borderRadius: 18,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginTop: 40,
                }} >

                    <VStack flex={2} space={3} >
                        <BoldText2 color={modalData.type == "ERROR" ? Colors.primary : "green"} text={modalData.header} />
                        <Text>
                            {modalData.msg}
                        </Text>
                        <HStack alignItems="center" mt={5} space={5} >
                            <Button bg={Colors.white} size="sm" variant="outline" style={{
                                width: 120,
                                backgroundColor: Colors.lightGray,
                                height: 50
                            }}
                                onPress={() => {
                                    setmodalData({
                                        ...modalData,
                                        isTrue: false
                                    })
                                    modalData.callBack()
                                }}
                                colorScheme={Colors.primary} borderRadius="full">

                                <HStack justifyContent="space-around" alignItems="center" space={3} >
                                    <Text style={{ color: "green" }} fontSize="xs">{modalData.buttonText}</Text>
                                </HStack>
                            </Button>

                        </HStack>
                    </VStack>
                </HStack>

            </ModalPop>

            {User &&
                <HStack
                    space={16}
                    style={{
                        marginTop: 100,
                        justifyContent: "center",
                        alignItems: "center",
                    }} >
                    <TouchableOpacity
                        style={{
                            height: 90,
                            width: 90,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onPress={() => {
                            handleBiometricAuth({
                                setbiometricLoader,
                                setkey,
                                Key,
                                isBiometric,
                                BiometricAuth,
                                message: "Unlock to use iVoucher",
                                callBack: () => {
                                    FetchUserInfo({
                                        setloading,
                                        id: Initialized,
                                        login,
                                        navigation
                                    })
                                }
                            })
                        }} >
                        <BiometricIcon color={Colors.dark} />
                    </TouchableOpacity>

                </HStack>
            }


        </SafeAreaView>
    );
}




export default LoginScreen;



const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
    welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    forgotPassword: { alignSelf: 'flex-end', marginVertical: 10 },
    loginButton: { backgroundColor: '#000', paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
    loginButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    registerText: { color: Colors.dark, marginTop: 20, textAlign: "center" },
});
