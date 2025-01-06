// screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native';
import { Color } from '../../global-components/colors';
import { Center, StatusBar } from 'native-base';
import { connect } from 'react-redux';
import { initAuth } from '../../redux';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { appState } from '../../state';
import { OnboardingIcon } from '../../global-components/icons';
import { BoldText, BoldText1, BoldText2 } from '../../global-components/texts';
const Colors = Color()

function Onboarding({ navigation }) {
    const { User, Initialized } = appState()

    const requestNotificationPermission = async (to) => {
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'Blake',
                        message:
                            'iVoucher needs access to ' +
                            'send you notification',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // console.log('You can use the camera');
                    to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
                } else {
                    to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
                    // requestNotificationPermission(to) 
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            // const permissionStatus = await check(PERMISSIONS.IOS.NOTIFICATIONS);
            // if (permissionStatus === RESULTS.DENIED) {
            //     const result = await request(PERMISSIONS.IOS.NOTIFICATIONS);
            //     if (result === RESULTS.GRANTED) {
            //         console.log('Notification permission granted');
            //     } else {
            //         console.log('Notification permission denied', permissionStatus);
            //     }
            // } else {
            //     console.log('Notification permission already granted');
            //     to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
            // }
            to == "Login" ? navigation.replace("Login") : navigation.replace("Register")
        }
    };



    return Initialized ? navigation.replace("Biometrics") : (
        // return (
        <>
            <StatusBar
                animated={true}
                backgroundColor="#F9EFE5"
                barStyle="dark-content"
            // showHideTransition={statusBarTransition}
            // hidden={hidden}
            />

            <View style={styles.container}>
                <OnboardingIcon />
                {/* <Text style={styles.guestText}>Continue as a guest</Text> */}
            </View>


            <Center style={styles.buttonContainer}>
                <Center style={{
                    padding: 10,
                    // marginTop: 10,
                }} >
                    <BoldText2 size={22} text="Easy Voucher Payment" color={Colors.dark} />
                    <BoldText style={{
                        marginVertical: 15
                    }} text="Make your payment experience with multiple merchants more better today. No transaction fee" color={Colors.dark} />
                </Center>

                {/* ?================= */}

                <TouchableOpacity style={styles.loginButton} onPress={() => {
                    // set_initAuth(true)
                    requestNotificationPermission("Login")
                    // navigation.replace('Login')
                }}>
                    <Text style={[styles.buttonText, { color: Colors.white }]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={() => {
                    // navigation.replace('Register')
                    requestNotificationPermission("Register")
                }}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </Center>
        </>
    );
}




export default Onboarding;


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: "#F9EFE5", paddingTop: 70 },
    buttonContainer: { width: '100%', alignItems: 'center', justifyContent: "center", backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 30 },
    loginButton: { backgroundColor: '#000', paddingVertical: 15, width: '100%', alignItems: 'center', marginVertical: 20, borderRadius: 5 },
    registerButton: { backgroundColor: '#fff', borderColor: '#000', borderWidth: 1, paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5 },
    buttonText: { color: '#000', fontWeight: 'bold' },
    guestText: { color: '#00B2E3', marginTop: 20, textDecorationLine: 'underline' },
});
