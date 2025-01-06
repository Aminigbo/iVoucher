// screens/RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../global-components/colors';
import { BackIcon } from '../../global-components/icons';
import { HStack } from 'native-base';
import { RegisterController } from '../controllers';

const Colors = Color()
export default function RegisterScreen({ navigation }) {
    const [loading, setloading] = React.useState(false)
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [pwd1, setPwd1] = React.useState("")
    const [pwd2, setPwd2] = React.useState("")
    let handleSignup = () => {

        if (!name || !email || !phone || !pwd1 || !pwd2) {
            return Alert.alert("Error", "You cannot submit an empty form")
        }

        if (pwd1 !== pwd2) {
            return Alert.alert("Error", "The password do not match")
        }


        setloading(true)
        const fcmToken = "onfrvaer;vefbnvf;kvaefjvkdfj"
        RegisterController({
            Alert,
            setloading,
            email, phone, name, pwd1,
            fcmToken,
            navigation

        })
    }

    return (
        <View style={styles.container}>
            <HStack alignItems="flex-start" justifyContent="flex-start" mb={20} >
                <TouchableOpacity onPress={() => navigation.replace("Onboarding")}>
                    <BackIcon />
                </TouchableOpacity>
            </HStack>


            <Text style={styles.headerText}>Register to get started</Text>
            <TextInput style={styles.input} placeholder="Fullname" onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email address" onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Phone number" keyboardType='numeric' onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPwd1} />
            <TextInput style={styles.input} placeholder="Confirm password" onChangeText={setPwd2} secureTextEntry />
            <TouchableOpacity style={styles.registerButton} onPress={handleSignup} >
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.registerButtonText}>Register</Text>}
            </TouchableOpacity>
            {/* <Text style={styles.orText}>Or Register with</Text>
            <View style={styles.socialButtons}>
                <Icon name="logo-facebook" size={30} color="#3b5998" />
                <Icon name="logo-google" size={30} color="#DB4437" />
                <Icon name="logo-apple" size={30} color="#000" />
            </View> */}
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.loginText}>Already have an account? Login Now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
    headerText: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', padding: 15, marginVertical: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
    registerButton: { backgroundColor: '#000', paddingVertical: 15, width: '100%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
    registerButtonText: { color: '#FFF', fontWeight: 'bold' },
    orText: { marginVertical: 20 },
    socialButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
    loginText: { color: Colors.dark, marginTop: 20, textAlign: 'center' },
});
