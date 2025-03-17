// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../global-components/colors';
import { BackIcon } from '../../global-components/icons';
import { Center, HStack, ScrollView } from 'native-base';
import { RegisterController } from '../controllers';
import { BoldText, BoldText1 } from '../../global-components/texts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck } from 'lucide-react-native';
import messaging from '@react-native-firebase/messaging';
import { Input } from '../../global-components/input';
import { CustomButtons } from '../../global-components/buttons';
import { SignupSvgs } from '../../assets/svgs';

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

    let inputData = [
        {
            placeHolder: "first name",
            label: true,
            labelText: "First name",
            onChange: setName
        },
        {
            placeHolder: "Last name",
            label: true,
            labelText: "Last name",
            onChange: setLastname
        },
        {
            placeHolder: "example@gmail.com",
            label: true,
            labelText: "Email",
            onChange: setEmail
        },
        {
            placeHolder: "+2348060000000",
            label: true,
            labelText: "Phone number",
            onChange: setPhone,
            type: "numeric"
        },
        {
            placeHolder: "********",
            label: true,
            labelText: "Password",
            onChange: setPwd1,
            secureTextEntry: true

        }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView p={15} >
                <HStack alignItems="center" justifyContent="flex-start" space={5} >
                    <TouchableOpacity onPress={() => navigation.replace("Onboarding")}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Sign up</Text>
                </HStack>

                <Center style={{ marginVertical: 40 }} >
                    <SignupSvgs />
                </Center>

                {inputData.map((inputs, index) => {
                    return <Input
                        Placeholder={inputs.placeHolder}
                        Label={inputs.label}
                        LabelText={inputs.labelText}
                        onChange={inputs.onChange}
                        LabelMargin={15}
                        secureTextEntry={inputs.secureTextEntry}
                        type={inputs.type}
                    />
                })}

                <CustomButtons
                    text="Sign up"
                    primary
                    Loading={loading}
                    callBack={handleSignup}
                />

                <TouchableOpacity onPress={() => {
                    // setModalVisible(!modalVisible)
                    navigation.replace('Login')
                }}>
                    <Text style={styles.loginText}>Already have an account? Login Now</Text>
                </TouchableOpacity>
            </ScrollView>




        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    headerText: { fontSize: 20, fontWeight: 'bold' },
    loginText: { color: Colors.dark, marginTop: -20, marginBottom: 40, textAlign: 'center' },



});
