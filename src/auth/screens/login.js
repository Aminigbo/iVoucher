// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, Keyboard } from 'react-native';

import { Button, Center, HStack, VStack } from 'native-base';
import { Color } from '../../global-components/colors.js';
import { LoginController } from '../../auth/controllers/index.js';
import { connect } from 'react-redux';
// import { initAuth, User } from '../../redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appState } from "../../state/index.js"
import ModalPop from '../../global-components/modal.js';
import { BoldText, BoldText2 } from '../../global-components/texts.js';
import messaging from '@react-native-firebase/messaging';
import { BackIcon, BiometricIcon } from '../../global-components/icons.js';
import { handleBiometricAuth } from '../../helpers/biometrics.js';
import { FetchUserInfo } from '../../helpers/user.js';
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from '../../global-components/input.js';
import { CustomButtons } from '../../global-components/buttons.js';
import { LoginSvgs } from '../../assets/svgs.js';
import { useAppActions, useAppState } from '../../state/state2.js';

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

    // let { User, login, Initialize, Initialized, isBiometric, BiometricAuth } = appState()
    let { User, Initialized, isBiometric, BiometricAuth } = useAppState()
    let { login, Initialize } = useAppActions()

    async function handleLogin() {
        setloading(!loading)
        Keyboard.dismiss()
        console.log("Logged in")
        LoginController({
            setloading,
            Alert,
            navigation,
            email,
            password,
            fcmToken: fcmToken ? fcmToken : "fcmToken",
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

    // return User ? navigation.replace("Biometrics") : (
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ padding: 20 }} >
                {console.log(User)}
                {/* <HStack alignItems="center" justifyContent="flex-start" space={5} >
                    <TouchableOpacity >
                        <BackIcon noPop={true} action={() => { navigation.replace("Onboarding") }} />
                    </TouchableOpacity>
                    <Text style={styles.welcomeText}>Login</Text>
                </HStack> */}

                <Center style={{ marginVertical: 70 }} >
                    <LoginSvgs />
                </Center>

                <Input
                    Placeholder="example@email.com"
                    Label
                    LabelText="Email"
                    onChange={setEmail}
                />

                <Input
                    LabelMargin={20}
                    Placeholder="* * * * * * * * *"
                    Label
                    LabelText="Password"
                    onChange={setPassword}
                    secureTextEntry
                />


                <TouchableOpacity style={styles.forgotPassword} onPress={() => {
                    navigation.navigate('Request-otp')
                }
                } >
                    <Text >Forgot Password?</Text>
                </TouchableOpacity>





                {User &&
                    <HStack
                        space={16}
                        style={{
                            marginTop: 20,
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


                <CustomButtons
                    text="Sign in"
                    primary
                    Loading={loading}
                    LoadingText="Confirming credentials"
                    callBack={handleLogin}
                />

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Don’t have an account? Register Now</Text>
                </TouchableOpacity>

            </ScrollView>


        </SafeAreaView>
    );
}




export default LoginScreen;



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    welcomeText: { fontSize: 20, fontWeight: 'bold', },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    forgotPassword: { alignSelf: 'flex-end', marginVertical: 10 },
    loginButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
    loginButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    registerText: { color: Colors.dark, marginTop: 10, textAlign: "center" },
});
