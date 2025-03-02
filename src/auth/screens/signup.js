// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../global-components/colors';
import { BackIcon } from '../../global-components/icons';
import { HStack, ScrollView } from 'native-base';
import { RegisterController } from '../controllers';
import { BoldText, BoldText1 } from '../../global-components/texts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck } from 'lucide-react-native';
import messaging from '@react-native-firebase/messaging';

const Colors = Color()
export default function RegisterScreen({ navigation }) {
    const [loading, setloading] = React.useState(false)
    const [name, setName] = React.useState("")
    const [lastName, setLastname] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [pwd1, setPwd1] = React.useState("")
    const [fcmToken, setfcmToken] = React.useState("")

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

    let handleSignup = () => {
        Keyboard.dismiss()
        if (!name || !email || !phone || !pwd1 || !lastName) {
            return Alert.alert("Error", "You cannot submit an empty form")
        }
        setloading(true)
        const fcmToken = "onfrvaer;vefbnvf;kvaefjvkdfj"
        RegisterController({
            Alert,
            setloading,
            email, phone, name, pwd1, lastName,
            fcmToken: fcmToken ? fcmToken : "fcmToken",
            navigation

        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView p={15} >
                <HStack alignItems="flex-start" justifyContent="flex-start" mb={20} >
                    <TouchableOpacity onPress={() => navigation.replace("Onboarding")}>
                        <BackIcon />
                    </TouchableOpacity>
                </HStack>

                <Text style={styles.headerText}>Register to get started</Text>

                <BoldText text="Enter first name" color="#000" />
                <TextInput style={styles.input} placeholder="first name" onChangeText={setName} />
                <BoldText text="Enter last name" color="#000" />
                <TextInput style={styles.input} placeholder="lastname" onChangeText={setLastname} />
                <BoldText text="Enter email address" color="#000" />
                <TextInput style={styles.input} placeholder="Email address" onChangeText={setEmail} />
                <BoldText text="Enter phone number" color="#000" />
                <TextInput style={styles.input} placeholder="Phone number" keyboardType='numeric' onChangeText={setPhone} />
                <BoldText text="Choose a password" color="#000" />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPwd1} />


            </ScrollView>

            <TouchableOpacity style={styles.registerButton} onPress={handleSignup} >
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.registerButtonText}>Register</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                // setModalVisible(!modalVisible)
                navigation.replace('Login')
            }}>
                <Text style={styles.loginText}>Already have an account? Login Now</Text>
            </TouchableOpacity>



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    headerText: { fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    registerButton: { backgroundColor: Colors.dark, paddingVertical: 15, width: '90%', alignItems: 'center', borderRadius: 5, marginVertical: 10, marginTop: 50, height: 55, alignSelf: "center" },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    loginText: { color: Colors.dark, marginVertical: 20, textAlign: 'center' },



});
